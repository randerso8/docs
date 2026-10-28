-- Candidate operator handler only: require explicit authorization and investigation first.
-- Do not expose this as an ordinary status update endpoint.
-- Run as one transaction; log no credential or raw exception details.
PREPARE mark_validation_failed (uuid,text,text) AS
WITH changed AS (
  UPDATE validation_job
  SET status='FAILED',failure_code=$2,completed_at=clock_timestamp(),
      total_count=NULL,invalid_count=NULL
  WHERE job_id=$1 AND status='PENDING'
  RETURNING job_id
)
INSERT INTO validation_job_audit (job_id,action,operator_ref)
SELECT job_id,'MARK_FAILED',$3 FROM changed
RETURNING job_id,action,occurred_at;

-- Bind $3 from the authenticated operator's approved internal reference.
-- A concurrent worker holding the job lock is resolved before the guarded update can complete.
-- A row already SUCCEEDED/FAILED is not overwritten; zero changed rows requires explicit handling.
