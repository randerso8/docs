---
{
  "id": "STD-004",
  "title": "Persistence and schema evolution",
  "type": "standard",
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
    "technologies": [],
    "workloads": []
  },
  "required_approvals": [
    "engineering",
    "security"
  ],
  "approvals": [],
  "depends_on": [
    "ARC-002",
    "STD-002"
  ],
  "requirements": [
    "DATA-STORE-001",
    "DATA-STORE-002",
    "DATA-STORE-003",
    "DATA-STORE-004",
    "DATA-STORE-005",
    "DATA-STORE-006"
  ],
  "requires": [],
  "supersedes": []
}
---

# Persistence and schema evolution

> Draft for Software Engineering team review. These are proposed requirements and guidance, not an approved standard.

## Scope

Apply to applications storing durable state. PostgreSQL is a primary technology; this document establishes application responsibilities without choosing an ORM, migration product, supported database version, or database-per-service topology. Purely stateless workloads record that persistent-state requirements are inapplicable with a rationale.

### DATA-STORE-001 — Data ownership and invariants

Each durable dataset MUST have a capability/application owner, permitted readers/writers, and defined invariants. Use database constraints for invariants that the database can reliably enforce; application-only pre-checks are not sufficient for concurrent uniqueness. Cross-capability writes require an explicit contract or reviewed shared-data arrangement.

Evidence: ownership map, schema constraints, and a concurrent-write test. PostgreSQL supports multiple constraint types for persistent integrity. [PostgreSQL constraints](https://www.postgresql.org/docs/18/ddl-constraints.html).

### DATA-STORE-002 — Reviewed versioned migrations

Schema and required data changes MUST use versioned, reviewable migrations with a known order and recorded execution state. Test creation from an empty supported database and upgrades from a representative prior state. Published migration history is preserved; corrections use new migrations rather than editing already-applied changes. Identify whether deployment permits one or several application versions concurrently.

Evidence: migration files, upgrade results, and a deployment compatibility plan.

### DATA-STORE-003 — Transaction and concurrency design

State-changing use cases MUST define atomic updates, isolation/locking assumptions, conflict handling, and transaction size. Keep unrelated network work outside a database transaction unless a specific reason is reviewed. For retryable transaction failures, reconstruct and retry the entire logical transaction within bounded policy rather than replaying an arbitrary failed statement.

Evidence: concurrency and rollback tests for the actual invariant. PostgreSQL documents isolation-dependent anomalies and complete-transaction retry requirements. [Transaction isolation](https://www.postgresql.org/docs/18/transaction-iso.html).

### DATA-STORE-004 — Safe and bounded data access

Database operations MUST use bound parameters or equivalent maintained APIs for values and allowlisted construction for dynamic identifiers. Bound query result size, connection use, and operation duration according to workload needs. Review indexes and execution behavior for representative volume. An ORM does not remove the need to inspect queries and transaction behavior.

Evidence: injection-negative cases and representative query/resource measurements. Access permissions are owned by the [security baseline](../security/application-security.md).

### DATA-STORE-005 — Data classification and retention

Persisted fields, exports, replicas, caches, and backups MUST have documented classification, access, retention/deletion expectations, and responsible owners. Retention duration is an explicit business/security decision; this proposal does not invent legal periods. Minimize sensitive copies and account for recovery copies when designing deletion.

Evidence: a data inventory and tested lifecycle for a representative sensitive record.

### DATA-STORE-006 — Recovery evidence

Applications with valuable durable state MUST define acceptable data loss and recovery time, identify backup/restore responsibility, and demonstrate restoration to an isolated environment. Validate recovered application behavior and required configuration, not just completion of a backup command. Define recovery from failed migrations and whether restoration, forward correction, or a compatible application rollback is appropriate.

Evidence: a dated restore exercise and migration recovery scenario. Backup methods have different operational assumptions. [PostgreSQL backup and restore](https://www.postgresql.org/docs/18/backup.html).

## Adoption and open decisions

Confirm migration tooling, support versions, recovery objectives, data categories, and restore-exercise cadence. Begin with one representative schema and recovery test before claiming the pattern covers all datasets.
