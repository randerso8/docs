---
{
  "id": "TECH-012",
  "title": "PostgreSQL application conventions",
  "type": "technology",
  "status": "draft",
  "revision": 1,
  "owner": "Software Engineering team",
  "classification": "internal",
  "authors": [
    "ai-assisted-drafting"
  ],
  "created": "2026-10-23",
  "updated": "2026-10-23",
  "review_due": "2027-01-23",
  "applicability": {
    "technologies": [
      "postgresql"
    ],
    "workloads": []
  },
  "required_approvals": [
    "engineering",
    "security"
  ],
  "approvals": [],
  "depends_on": [
    "GOV-010",
    "STD-004",
    "STD-002",
    "STD-006",
    "STD-005",
    "STD-003"
  ],
  "requirements": [
    "PG-DATA-001",
    "PG-DATA-002",
    "PG-DATA-003",
    "PG-DATA-004",
    "PG-DATA-005",
    "PG-DATA-006",
    "PG-DATA-007"
  ],
  "requires": [
    "DATA-STORE-001",
    "DATA-STORE-006",
    "SEC-BASE-006",
    "DATA-STORE-002",
    "REL-WORK-002",
    "REL-WORK-003",
    "DATA-STORE-003",
    "DATA-STORE-004",
    "INT-CONTRACT-005",
    "IAM-CORE-002"
  ],
  "supersedes": []
}
---

# PostgreSQL application conventions

> Draft for Software Engineering team review. Proposed guidance; no formal approval, supported product selection, or runtime certification is implied.

## Applicability and authority

Apply when PostgreSQL stores application state or supports application queries. DATA-STORE-001 through DATA-STORE-006 remain the authoritative shared data requirements; this document adds PostgreSQL-specific implementation and review detail. Read the [support framework](../../governance/technology-support.md). No hosting service, ORM, migration runner, extension, backup product, or replica topology is selected.

### PG-DATA-001 — Effective roles, object ownership, and schemas

A PostgreSQL design MUST identify object-creating/migration roles, runtime roles, schema ownership, effective inherited grants, and default privileges for future objects. Runtime access should not depend on owning application objects. Review PUBLIC grants, schema creation rights, function execution rights, and search_path; SECURITY DEFINER functions need an explicit owner, safe object resolution, and restricted execution. SEC-BASE-006 owns least privilege.

Evidence: positive and negative operations executed as the actual runtime role, including an object created by the actual migration role. PostgreSQL [object privileges](https://www.postgresql.org/docs/18/ddl-priv.html) distinguish ownership rights from grants; [default privileges](https://www.postgresql.org/docs/18/sql-alterdefaultprivileges.html) apply to future objects based on the creating role, not automatically on every role it belongs to.

### PG-DATA-002 — DDL execution and lock-aware migrations

Each PostgreSQL migration MUST state its transaction mode, relevant locks and lock/wait budget, expected data work, coexistence assumptions, and failure recovery. Distinguish transactional DDL from operations requiring separate execution. For concurrent index creation, verify completion/validity and recovery after an interrupted or failed build. Do not assume that wrapping every migration in one transaction is correct, or that concurrent means no locking. Identify one accountable migration execution path rather than allowing every application replica to race unmanaged startup changes. DATA-STORE-002 owns migration versioning and compatibility.

Evidence: upgrade from representative prior data, a blocked/failed migration, and subsequent recovery. PostgreSQL [CREATE INDEX](https://www.postgresql.org/docs/18/sql-createindex.html) documents that CREATE INDEX CONCURRENTLY cannot run in a transaction block and may leave an invalid index on failure.

### PG-DATA-003 — Transaction failure classification and connection reset

PostgreSQL transaction handling MUST classify retry decisions using SQLSTATE and operation semantics, not localized message text. A serialization failure requires retrying the complete transaction, including decisions that selected statements/values. Treat deadlocks according to the reviewed bounded-retry policy; do not retry every integrity error. Roll back failed transactions and restore or discard pooled connections before reuse. Uncertain commit outcomes require reconciliation or idempotency rather than an assumption of failure. REL-WORK-002 and REL-WORK-003 own retry/effect policy; DATA-STORE-003 owns concurrency correctness.

Evidence: injected serialization/deadlock failures, bounded whole-transaction retries, aborted connection reuse prevention, and a lost-commit-response case. PostgreSQL [serialization failure handling](https://www.postgresql.org/docs/18/mvcc-serialization-failure-handling.html) identifies SQLSTATE 40001 and the whole-transaction retry boundary.

### PG-DATA-004 — Representative query and plan evidence

Material PostgreSQL query paths MUST have plan/latency evidence using representative cardinality, distributions, parameters, and statistics. Review repeated-query behavior, result volume, indexes, and contention rather than requiring a particular scan type. Bound values through the driver and validate dynamic identifier choices under DATA-STORE-004. Do not run EXPLAIN ANALYZE on a write or effectful function as if it were a read-only preview; it executes the statement, and a surrounding rollback does not undo every possible external/nontransactional effect.

Evidence: a safe isolated workload and plans tied to dataset shape, schema, server/driver version, and latency goal. PostgreSQL [EXPLAIN guidance](https://www.postgresql.org/docs/18/using-explain.html) explains execution and the limits of extrapolating toy-sized plans.

### PG-DATA-005 — Deliberate SQL and application type mappings

Applications MUST define PostgreSQL/application mappings for identifiers, exact numbers, timestamps, dates, JSON, and nullability used at public or persistent boundaries. Choose precision/range constraints and test driver serialization. A timestamptz value represents an instant and does not retain the original named time zone; store a separate zone when business rules require it. JSON storage does not replace validation or relational constraints for owned invariants. INT-CONTRACT-005 owns representation semantics.

Evidence: boundary/range, null, decimal, date/time, and JSON round trips through the actual driver. See [PostgreSQL date/time types](https://www.postgresql.org/docs/18/datatype-datetime.html).

### PG-DATA-006 — Tenant context and row security behavior

Where access depends on tenant/resource context, PostgreSQL integration MUST carry server-validated context into every relevant query and verify isolation with the real connection pool and database role. If row-level security is selected as a control, record its policies, owner/bypass behavior, required FORCE setting where applicable, and implications for maintenance/functions. Do not infer protection from testing as a superuser or assume a pooled session retains the correct tenant. Reset/discard context safely and prefer transaction-scoped settings where suitable. IAM-CORE-002 remains the resource-authorization requirement; this does not mandate row-level security for every application.

Evidence: cross-tenant reads/writes, reused connections, absent context, privileged-role behavior, and policy failure. PostgreSQL [row security](https://www.postgresql.org/docs/18/ddl-rowsecurity.html) describes owner and BYPASSRLS exceptions and constraint-related caveats.

### PG-DATA-007 — Maintenance, read consistency, and restore boundaries

The PostgreSQL operating design MUST assign responsibility for vacuum/statistics, storage/transaction growth, connection pressure, and recovery verification. If replicas are used, state which reads may be stale, how read-after-write requirements are met, and behavior during failover. Match backup/restore procedures to the chosen server/extension/topology and test application invariants after restore. Replication is not itself a backup. DATA-STORE-006 owns recovery targets and restore evidence.

Evidence: maintenance/health signals, a stale-replica or failover case when applicable, and a restore exercise on the selected platform. [Routine vacuuming](https://www.postgresql.org/docs/18/routine-vacuuming.html) explains why ongoing maintenance matters.

## Application review pack

Include the role/schema diagram, migration runner and execution identity, transaction/retry boundaries, driver/type mapping, critical query evidence, tenant isolation checks if applicable, and maintenance/restore owner. The [worked SQL fixture](../../examples/validation-job/README.md) illustrates a short database-owned operation; it is unexecuted and does not validate this broader review pack.

Official references checked on 2026-10-23. Reference editions and moving documentation pages do not select an approved runtime version. Recheck the documentation for the version actually selected. Requirements above are proposed team conventions.
