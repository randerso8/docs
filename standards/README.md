---
{
  "id": "STD-001",
  "title": "Standards domains and priorities",
  "type": "guide",
  "status": "draft",
  "revision": 3,
  "owner": "Software Engineering team",
  "classification": "internal",
  "authors": [
    "ai-assisted-bootstrap",
    "ai-assisted-drafting"
  ],
  "created": "2026-10-23",
  "updated": "2026-10-24",
  "review_due": "2027-01-23",
  "applicability": {
    "technologies": [],
    "workloads": []
  },
  "required_approvals": [
    "engineering"
  ],
  "approvals": [],
  "depends_on": [
    "GOV-007"
  ],
  "requirements": [],
  "requires": [],
  "supersedes": []
}
---

# Standards domains and priorities

> Draft for Software Engineering team review. This document is not an approved standard.

## Technical review bundle

| Domain | Draft source | Focus |
| --- | --- | --- |
| Security | [Application security](security/application-security.md) | Trust, inputs, secrets, transport, safe platform features, privileges, disclosure |
| Identity | [Identity and authorization](identity-and-access/identity-and-authorization.md) | Principals, resource permissions, assertions, login, workloads, rotation/outage |
| Integration | [Contracts and compatibility](api-and-integration/contracts-and-compatibility.md) | Ownership, evolution, errors, protocol semantics, representations, collections |
| Data | [Persistence and migrations](data/persistence-and-migrations.md) | Ownership, schema evolution, concurrency, queries, retention, restore |
| Reliability | [Execution and recovery](reliability/execution-and-recovery.md) | Budgets, retries, duplicates, overlap, restart, acknowledgment, shutdown |
| Observability | [Operational signals](observability/operational-signals.md) | Correlation, outcomes, health, telemetry bounds, investigation |
| Testing | [Verification evidence](testing/verification-evidence.md) | Traceability, meaningful tests, actual dependencies, failures, reproducibility |
| Delivery | [Build and change control](delivery/build-and-change-control.md) | Inputs/artifacts, dependencies, configuration, compatibility, promotion |

Each requirement is owned once by its source document and has a stable ID and evidence expectation. Workload profiles and patterns reference those sources. All are drafts; no requirement has been approved through this bundle.

## How to review

Review architecture principles and security/identity first, then data and contracts, then execution, operational evidence, testing, and delivery. Check that each obligation is necessary, testable, proportionate, and owned by the right source. Record organization-specific choices and exceptions separately.

## Navigation and authority

Links here are a reading/progress index, not additional implementation obligations or approval prerequisites. Resolve actual source dependencies and lifecycle through the catalog and pinned release. A linked draft remains draft.
