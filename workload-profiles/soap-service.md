---
{
  "id": "WRK-002",
  "title": "SOAP service workload profile",
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
      "soap-service"
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
    "SEC-BASE-005",
    "IAM-CORE-001",
    "IAM-CORE-002",
    "INT-CONTRACT-001",
    "INT-CONTRACT-002",
    "INT-CONTRACT-004",
    "REL-WORK-001",
    "REL-WORK-002",
    "TEST-EVID-003"
  ],
  "supersedes": []
}
---

# SOAP service workload profile

> Draft for Software Engineering team review. This document is not an approved standard.

## Applicability

SOAP providers and clients, including integrations with externally controlled contracts. The partner's binding/security capabilities are a constraint to document, not a reason to infer trust.

## Referenced review priorities

These references highlight workload concerns. They are not an exemption from other applicable requirements in the source standards. Conditions in each source requirement determine applicability.

| Source requirement | Review focus |
| --- | --- |
| [SEC-BASE-005](../standards/security/application-security.md) | Safe XML and parser behavior |
| [IAM-CORE-001](../standards/identity-and-access/identity-and-authorization.md) | Trusted caller identity |
| [IAM-CORE-002](../standards/identity-and-access/identity-and-authorization.md) | Action/resource authorization |
| [INT-CONTRACT-001](../standards/api-and-integration/contracts-and-compatibility.md) | WSDL/XSD ownership |
| [INT-CONTRACT-002](../standards/api-and-integration/contracts-and-compatibility.md) | Partner compatibility |
| [INT-CONTRACT-004](../standards/api-and-integration/contracts-and-compatibility.md) | SOAP version/binding/fault semantics |
| [REL-WORK-001](../standards/reliability/execution-and-recovery.md) | Bounded dependency calls |
| [REL-WORK-002](../standards/reliability/execution-and-recovery.md) | Classified retries |
| [TEST-EVID-003](../standards/testing/verification-evidence.md) | Protocol interoperability evidence |

## Verification scenario

Exercise the intended SOAP binding with an independent client: valid exchange, namespace/schema mismatch, untrusted external-entity input, missing/invalid identity, defined fault, partner timeout, and an ambiguous state-changing outcome. Verify faults at the SOAP layer as well as transport behavior.

## Application decisions and evidence

Record SOAP version, namespaces, schema resolution, transport, WS-* requirements if any, certificate/trust ownership, partner test environment, and operation-specific retry/reconciliation. No SOAP stack, version, or WS-Security configuration is approved by this profile.

Keep the chosen values, local ADRs, evidence, runbooks, and exceptions in the application repository. This draft profile selects review topics; it does not grant approval or assert an application is compliant.
