---
{
  "id": "WRK-001",
  "title": "REST API workload profile",
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
      "rest-api"
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
    "ARC-DESIGN-002",
    "IAM-CORE-002",
    "IAM-CORE-003",
    "INT-CONTRACT-002",
    "INT-CONTRACT-004",
    "INT-CONTRACT-006",
    "REL-WORK-003",
    "OBS-OPER-003",
    "TEST-EVID-003"
  ],
  "supersedes": []
}
---

# REST API workload profile

> Draft for Software Engineering team review. This document is not an approved standard.

## Applicability

HTTP request/response providers and the clients consuming them. Select the actual implementation technologies separately. A REST API can also enqueue or execute background work; select those workload profiles too.

## Referenced review priorities

These references highlight workload concerns. They are not an exemption from other applicable requirements in the source standards. Conditions in each source requirement determine applicability.

| Source requirement | Review focus |
| --- | --- |
| [ARC-DESIGN-002](../architecture/principles/engineering-principles.md) | Business/adapter separation |
| [IAM-CORE-002](../standards/identity-and-access/identity-and-authorization.md) | Resource authorization |
| [IAM-CORE-003](../standards/identity-and-access/identity-and-authorization.md) | API token validation |
| [INT-CONTRACT-002](../standards/api-and-integration/contracts-and-compatibility.md) | Consumer compatibility |
| [INT-CONTRACT-004](../standards/api-and-integration/contracts-and-compatibility.md) | HTTP and completion semantics |
| [INT-CONTRACT-006](../standards/api-and-integration/contracts-and-compatibility.md) | Collection bounds |
| [REL-WORK-003](../standards/reliability/execution-and-recovery.md) | Repeatable command effects |
| [OBS-OPER-003](../standards/observability/operational-signals.md) | Readiness/health |
| [TEST-EVID-003](../standards/testing/verification-evidence.md) | Real contract and dependency evidence |

## Verification scenario

Use the [request pipeline](../patterns/application/rest-request-pipeline.md) as a candidate responsibility map. For a synthetic create command, walk through a valid request, denied access to another user's object, malformed input, concurrency conflict, a duplicate command, and commit followed by a disconnected client. For a list request, review stable ordering and concurrent updates.

## Application decisions and evidence

Record contract ownership, method/status mapping, error schema, pagination, timeout budgets, operation identity, and whether any result means accepted rather than complete. Choose browser session design independently of the frontend framework.

Keep the chosen values, local ADRs, evidence, runbooks, and exceptions in the application repository. This draft profile selects review topics; it does not grant approval or assert an application is compliant.
