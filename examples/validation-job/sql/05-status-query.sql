-- All predicates are required in this same-actor reference access model.
-- Application policy checks status-read permission before running the query.
PREPARE get_validation_status (text,text,uuid) AS
SELECT job_id,dataset_id,dataset_version,status,created_at,completed_at,
       total_count,invalid_count,failure_code
FROM validation_job
WHERE tenant_id=$1 AND actor_id=$2 AND job_id=$3;

-- No row means not found or outside resource scope; do not issue an unscoped fallback lookup.
-- Map snake_case SQL fields to the OpenAPI response variant for the current status.
-- Never expose input_fingerprint, actor identity, or the idempotency key in the status body.
