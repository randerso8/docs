---
{
  "id": "STD-008",
  "title": "Engineering verification evidence",
  "type": "standard",
  "status": "draft",
  "revision": 2,
  "owner": "Software Engineering team",
  "classification": "internal",
  "authors": [
    "ai-assisted-drafting"
  ],
  "created": "2026-10-23",
  "updated": "2026-10-28",
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
    "ARC-002",
    "STD-002",
    "STD-003",
    "STD-004",
    "STD-005",
    "STD-006",
    "STD-007",
    "GOV-001"
  ],
  "requirements": [
    "TEST-EVID-001",
    "TEST-EVID-002",
    "TEST-EVID-003",
    "TEST-EVID-004",
    "TEST-EVID-005"
  ],
  "requires": [
    "ARC-DESIGN-002",
    "GOV-AUTH-001",
    "GOV-AUTH-002"
  ],
  "supersedes": []
}
---

# Engineering verification evidence

> Draft for Software Engineering team review. These are proposed requirements and guidance, not an approved standard.

## Scope

Apply to all application workloads. Verify obligations and business outcomes, not merely implementation details. This standard proposes categories of evidence; it does not set an arbitrary code-coverage percentage or mandate a test framework.

### TEST-EVID-001 — Requirement-to-evidence mapping

Each applicable requirement MUST have identifiable verification evidence, or a documented disposition permitted by its source obligation and GOV-AUTH-001/GOV-AUTH-002. Evidence may be an automated test, reproducible analysis, or operational exercise appropriate to the actual actor/component and behavior. An approved exception authorizes a scoped departure; it is not proof that the original behavior was implemented. Recording an unresolved gap does not satisfy the obligation or establish compliance. Recording an unresolved gap does not satisfy the obligation or establish compliance. Record what was checked, the relevant source/configuration version, and the remaining limitation. Generated assertions, mocks returning configured answers, and a green generic pipeline do not alone prove behavior.

Evidence: a local compliance table mapping requirement IDs to concrete evidence and unresolved gaps.

### TEST-EVID-002 — Focused rule and boundary tests

Core business rules MUST be tested with meaningful success, boundary, and rejection cases independently of infrastructure. Test adapter wiring and integration separately. Avoid test structures that merely mirror private methods or assert every internal call when the public outcome is what matters. ARC-DESIGN-002 owns the architectural separation making this practical.

Evidence: a representative rule change fails a relevant test, while a safe internal refactor preserves it.

### TEST-EVID-003 — Real dependency and contract evidence

Behavior depending on a database, protocol, identity library, or external contract MUST be verified against a representative real implementation/version or a justified equivalent environment. Lightweight substitutes are not assumed to reproduce PostgreSQL locking, SQL, schema evolution, or actual token validation. Combine component integration tests with provider/consumer contract tests rather than requiring every test to start the entire system.

Evidence: database migration/concurrency results, identity-negative cases, and protocol compatibility tests at the actual boundary.

### TEST-EVID-004 — Security and failure-path verification

Verification MUST include relevant denied access, unsafe input, dependency outage, duplicate execution, partial completion, interruption, and recovery scenarios. Check durable effects and resource bounds, not just returned status. Select scenarios from the threat model and workload profile, recording why a scenario is inapplicable.

Evidence: tests/exercises tied to security and reliability IDs with observed post-failure state.

### TEST-EVID-005 — Reproducible safe execution

Tests and exercises MUST have controlled setup, deterministic inputs where practical, isolated state, safe credentials/data, and verifiable cleanup. Record required services, versions, and commands. Quarantined or flaky checks have an owner and remediation deadline; disabling a failing check cannot silently stand in for passing evidence.

Evidence: another team member can repeat the scenario without production access or unpublished manual steps.

## Evidence interpretation

Evidence paragraphs are illustrative under GOV-AUTH-001. Choose evidence that would detect failure of the actual obligation; do not add a database, HTTP endpoint, queue, polling feature, or other component merely to reproduce an example. A source's explicitly required verification remains mandatory within its scope. Record why a different test or analysis covers the same obligation and which conditions are absent. Pending tests, planned exercises, and generated descriptions remain pending evidence.

Central review/release evidence establishes central governance facts, not application correctness. Shared platform evidence covers only its stated environment, version, and responsibility; verify the application-specific integration separately. A stateless service can demonstrate configuration, dependency, authorization, and shutdown behavior without fabricating database transaction tests. A UI without polling needs relevant rendered-interaction and lifecycle evidence, not a synthetic poll workflow.

## Verification review

Review which failures the evidence would detect and which it cannot. Prefer a smaller set that distinguishes meaningful regressions to many assertions coupled to implementation. Keep evidence with the application, while central standards own the requirements being checked.

## Adoption and decisions

Confirm test tools, representative environments, minimum release evidence, and exercise cadence using pilot applications. Security verification fits within the wider development lifecycle; [NIST SSDF](https://csrc.nist.gov/pubs/sp/800/218/final) provides a public framework informing that review.
