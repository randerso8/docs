-- Synthetic reference DDL. Not an approved migration or executed database fixture.
-- Use only in an isolated empty reference database/schema.
-- Runtime permissions and immutable input sealing require an application-owned design.

CREATE TABLE sample_dataset (
  tenant_id text NOT NULL,
  dataset_id text NOT NULL CHECK (dataset_id ~ '^sample-[a-z0-9][a-z0-9-]{0,39}$'),
  dataset_version integer NOT NULL CHECK (dataset_version > 0),
  PRIMARY KEY (tenant_id, dataset_id, dataset_version)
);

CREATE TABLE sample_item (
  tenant_id text NOT NULL,
  dataset_id text NOT NULL,
  dataset_version integer NOT NULL,
  item_no integer NOT NULL CHECK (item_no BETWEEN 1 AND 1000),
  is_valid boolean NOT NULL,
  PRIMARY KEY (tenant_id, dataset_id, dataset_version, item_no),
  FOREIGN KEY (tenant_id, dataset_id, dataset_version)
    REFERENCES sample_dataset (tenant_id, dataset_id, dataset_version)
);

CREATE TABLE validation_job (
  job_id uuid PRIMARY KEY,
  tenant_id text NOT NULL,
  actor_id text NOT NULL,
  idempotency_key text NOT NULL CHECK (idempotency_key ~ '^[A-Za-z0-9_-]{8,128}$'),
  input_fingerprint text NOT NULL CHECK (input_fingerprint ~ '^[a-f0-9]{64}$'),
  dataset_id text NOT NULL,
  dataset_version integer NOT NULL,
  status text NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING','SUCCEEDED','FAILED')),
  total_count integer,
  invalid_count integer,
  failure_code text CHECK (failure_code IS NULL OR failure_code IN ('INPUT_UNAVAILABLE','RETRY_EXHAUSTED','OPERATOR_ABORTED')),
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  completed_at timestamptz,
  UNIQUE (tenant_id, actor_id, idempotency_key),
  FOREIGN KEY (tenant_id, dataset_id, dataset_version)
    REFERENCES sample_dataset (tenant_id, dataset_id, dataset_version),
  CHECK (
    (status = 'PENDING' AND total_count IS NULL AND invalid_count IS NULL AND failure_code IS NULL AND completed_at IS NULL)
    OR (status = 'SUCCEEDED' AND total_count IS NOT NULL AND invalid_count IS NOT NULL
        AND total_count BETWEEN 0 AND 1000 AND invalid_count BETWEEN 0 AND total_count
        AND failure_code IS NULL AND completed_at IS NOT NULL)
    OR (status = 'FAILED' AND total_count IS NULL AND invalid_count IS NULL
        AND failure_code IS NOT NULL AND completed_at IS NOT NULL)
  )
);

CREATE INDEX validation_job_pending_order
  ON validation_job (created_at, job_id) WHERE status = 'PENDING';

CREATE TABLE validation_job_audit (
  job_id uuid NOT NULL REFERENCES validation_job (job_id),
  action text NOT NULL CHECK (action = 'MARK_FAILED'),
  operator_ref text NOT NULL,
  occurred_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);
