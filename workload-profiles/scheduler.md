---
{
  "id": "WRK-003",
  "title": "Scheduler workload profile",
  "type": "workload-profile",
  "status": "draft",
  "revision": 2,
  "owner": "Software Engineering team",
  "classification": "internal",
  "authors": [
    "ai-assisted-bootstrap",
    "ai-assisted-drafting"
  ],
  "created": "2026-10-23",
  "updated": "2026-10-23",
  "review_due": "2027-01-23",
  "applicability": {
    "technologies": [],
    "workloads": [
      "scheduler"
    ]
  },
  "required_approvals": [
    "engineering",
    "security"
  ],
  "approvals": [],
  "depends_on": [
    "GOV-001",
    "GOV-006",
    "ARC-002",
    "STD-002",
    "STD-003",
    "STD-004",
    "STD-005",
    "STD-006",
    "STD-007",
    "STD-008",
    "STD-009"
  ],
  "requirements": [],
  "requires": [
    "IAM-CORE-005",
    "REL-WORK-003",
    "REL-WORK-004",
    "REL-WORK-005",
    "REL-WORK-007",
    "OBS-OPER-002",
    "TEST-EVID-004"
  ],
  "supersedes": []
}
---

# Scheduler workload profile

> Draft for Software Engineering team review. This document is not an approved standard.

## Applicability

Time-triggered work and orchestration. A schedule starts a business operation; scheduling code should not become the only home of the business rule. Combine with batch/message profiles when it orchestrates those workloads.

## Referenced review priorities

These references highlight workload concerns. They are not an exemption from other applicable requirements in the source standards. Conditions in each source requirement determine applicability.

| Source requirement | Review focus |
| --- | --- |
| [IAM-CORE-005](../standards/identity-and-access/identity-and-authorization.md) | Unattended execution authority |
| [REL-WORK-003](../standards/reliability/execution-and-recovery.md) | Operation identity across retriggers |
| [REL-WORK-004](../standards/reliability/execution-and-recovery.md) | Overlap and calendar behavior |
| [REL-WORK-005](../standards/reliability/execution-and-recovery.md) | Recoverable progress |
| [REL-WORK-007](../standards/reliability/execution-and-recovery.md) | Shutdown and operator recovery |
| [OBS-OPER-002](../standards/observability/operational-signals.md) | Outcome and lateness signals |
| [TEST-EVID-004](../standards/testing/verification-evidence.md) | Failure-path evidence |

## Verification scenario

Use a synthetic daily job to test duplicate triggers, two active instances, a missed trigger, a daylight-saving transition, a long-running overlap, and worker termination. Verify whether recovery skips, catches up, coalesces, or deliberately reruns work. A clock trigger is not proof the job completed.

## Application decisions and evidence

Record schedule/time zone, business date/window identity, catch-up policy, overlap behavior, durable state, maximum execution budget, service identity, and remediation owner. Evaluate the [durable receipt pattern](../patterns/integration/durable-work-receipts.md) only when its storage/atomicity assumptions fit.

Keep the chosen values, local ADRs, evidence, runbooks, and exceptions in the application repository. This draft profile selects review topics; it does not grant approval or assert an application is compliant.
