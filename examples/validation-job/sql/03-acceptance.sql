-- SQL sketches using PREPARE for parameter contracts. Authorization belongs to the caller.
-- Bind tenant/actor from validated server context, not from untrusted request fields.
-- The same transaction performs insert, then a separate lookup statement when no row was inserted.

PREPARE accept_validation (uuid,text,text,text,text,integer,text) AS
INSERT INTO validation_job
  (job_id,tenant_id,actor_id,idempotency_key,dataset_id,dataset_version,input_fingerprint)
VALUES ($1,$2,$3,$4,$5,$6,$7)
ON CONFLICT (tenant_id,actor_id,idempotency_key) DO NOTHING
RETURNING job_id,status;

PREPARE find_validation_by_intent (text,text,text) AS
SELECT job_id,input_fingerprint,status
FROM validation_job
WHERE tenant_id=$1 AND actor_id=$2 AND idempotency_key=$3;

-- On conflict: compare the stored fingerprint before returning an authorized existing outcome.
-- Use a separate statement at READ COMMITTED to obtain a new snapshot after a concurrent conflict.
-- Do not replace this flow with an unexamined single-snapshot insert/select CTE.
-- If the row is still unavailable, abort safely/retry within policy; do not invent a new intent key.
