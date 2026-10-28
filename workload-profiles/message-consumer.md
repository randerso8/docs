---
{
  "id": "WRK-005",
  "title": "Message consumer workload profile",
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
      "message-consumer"
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
    "SEC-BASE-002",
    "IAM-CORE-005",
    "INT-CONTRACT-002",
    "REL-WORK-001",
    "REL-WORK-003",
    "REL-WORK-006",
    "REL-WORK-007",
    "OBS-OPER-002",
    "TEST-EVID-004"
  ],
  "supersedes": []
}
---

# Message consumer workload profile

> Draft for Software Engineering team review. This document is not an approved standard.

## Applicability

Asynchronous messages/events where redelivery, delay, reordering, malformed input, and consumer interruption are plausible. No broker, acknowledgment mode, or ordering guarantee has been selected.

## Referenced review priorities

These references highlight workload concerns. They are not an exemption from other applicable requirements in the source standards. Conditions in each source requirement determine applicability.

| Source requirement | Review focus |
| --- | --- |
| [SEC-BASE-002](../standards/security/application-security.md) | Message validation and resource bounds |
| [IAM-CORE-005](../standards/identity-and-access/identity-and-authorization.md) | Consumer authority |
| [INT-CONTRACT-002](../standards/api-and-integration/contracts-and-compatibility.md) | Schema/consumer compatibility |
| [REL-WORK-001](../standards/reliability/execution-and-recovery.md) | Concurrency and backpressure |
| [REL-WORK-003](../standards/reliability/execution-and-recovery.md) | Duplicate effects |
| [REL-WORK-006](../standards/reliability/execution-and-recovery.md) | Commit/acknowledgment and poison work |
| [REL-WORK-007](../standards/reliability/execution-and-recovery.md) | Rebalance/shutdown recovery |
| [OBS-OPER-002](../standards/observability/operational-signals.md) | Completion lag and backlog |
| [TEST-EVID-004](../standards/testing/verification-evidence.md) | Failure-path evidence |

## Verification scenario

Deliver a synthetic message twice and concurrently, stop the worker before and after commit, fail acknowledgment, inject a poison message, and replay quarantined work through an authorized path. For ordering-sensitive behavior, reorder or delay related events. Verify actual effects and terminal states.

## Application decisions and evidence

Record broker guarantees, subscriptions, operation identity, partition/order scope, acknowledgment boundary, retries/quarantine/replay, retention horizon, concurrency, and lag objectives. The [durable receipt pattern](../patterns/integration/durable-work-receipts.md) covers one database-owned effect boundary; it does not prove universal exactly-once delivery.

Keep the chosen values, local ADRs, evidence, runbooks, and exceptions in the application repository. This draft profile selects review topics; it does not grant approval or assert an application is compliant.
