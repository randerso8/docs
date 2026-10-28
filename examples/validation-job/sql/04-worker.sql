-- Prepare once per reference worker session/connection.
-- Execution sequence: BEGIN; EXECUTE claim_validation; then (if a row was claimed)
-- EXECUTE complete_validation('<claimed UUID>'); COMMIT; otherwise COMMIT without processing.
-- Keep the row lock, processing, result update, and terminal transition in one short transaction.
-- Do not perform remote calls in this transaction or commit the claim separately.

PREPARE claim_validation AS
SELECT job_id,tenant_id,dataset_id,dataset_version
FROM validation_job
WHERE status='PENDING'
ORDER BY created_at,job_id
LIMIT 1
FOR UPDATE SKIP LOCKED;

PREPARE complete_validation (uuid) AS
WITH counts AS (
  SELECT j.job_id,count(i.item_no)::integer AS total_count,
         count(i.item_no) FILTER (WHERE NOT i.is_valid)::integer AS invalid_count
  FROM validation_job j
  LEFT JOIN sample_item i
    ON i.tenant_id=j.tenant_id AND i.dataset_id=j.dataset_id AND i.dataset_version=j.dataset_version
  WHERE j.job_id=$1 AND j.status='PENDING'
  GROUP BY j.job_id
)
UPDATE validation_job j
SET status='SUCCEEDED',total_count=c.total_count,invalid_count=c.invalid_count,
    completed_at=clock_timestamp(),failure_code=NULL
FROM counts c
WHERE j.job_id=c.job_id AND j.status='PENDING'
RETURNING j.job_id,j.status,j.total_count,j.invalid_count;

-- Assert that completion changed exactly the one claimed row.
-- On unexpected/permanent failure, roll back and stop automatic polling for intervention.
-- Transient retries have a configured attempt/time budget; exhausted retries also stop polling.
-- This minimal example does not implement durable attempts, leases, fairness, or a poison-work service.
