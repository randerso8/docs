---
{
  "id": "STD-005",
  "title": "Integration contracts and compatibility",
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
    "engineering"
  ],
  "approvals": [],
  "depends_on": [
    "STD-002",
    "STD-003"
  ],
  "requirements": [
    "INT-CONTRACT-001",
    "INT-CONTRACT-002",
    "INT-CONTRACT-003",
    "INT-CONTRACT-004",
    "INT-CONTRACT-005",
    "INT-CONTRACT-006"
  ],
  "requires": [
    "SEC-BASE-005",
    "SEC-BASE-007"
  ],
  "supersedes": []
}
---

# Integration contracts and compatibility

> Draft for Software Engineering team review. These are proposed requirements and guidance, not an approved standard.

## Scope

Apply to application-owned REST, SOAP, message, file, and outbound integration contracts. A profile selects the relevant protocol-specific requirements. Integration contracts do not require every workload to expose an API. Security and identity remain owned by their source standards.

### INT-CONTRACT-001 — Owned explicit contracts

Every externally consumed interface MUST identify its owner, consumers, operations, schema, validation behavior, expected completion meaning, and evolution mechanism. Keep a machine-readable contract where the protocol supports one, such as OpenAPI, WSDL/XSD, or a message schema. Review the contract together with implementation changes.

Evidence: a version-controlled contract and representative accepted/rejected exchanges using synthetic data.

### INT-CONTRACT-002 — Consumer-aware compatibility

Contract changes MUST be assessed against actual consumer assumptions before rollout. Removing/renaming fields, narrowing accepted input, changing units or meaning, adding required input, and altering enum behavior can break consumers. A nominally additive field is not automatically compatible with every consumer. Record migration, coexistence, and retirement plans for breaking changes.

Evidence: compatibility tests with a representative existing client and an explicit change assessment.

### INT-CONTRACT-003 — Stable safe error contracts

Interfaces MUST distinguish validation, unauthenticated, unauthorized, missing-resource, conflict, transient dependency, and unexpected failures where relevant. Publish machine-readable error categories and safe diagnostic correlation. Apply SEC-BASE-007 for disclosure, rather than returning runtime stack traces or raw dependency errors. Preserve the protocol's security conventions where disclosing resource existence would be inappropriate.

Evidence: a documented error matrix and tests for intentional failure paths.

### INT-CONTRACT-004 — Protocol-correct operation semantics

HTTP interfaces MUST respect method/status semantics and document whether a response means accepted or completed. The proposed default for new JSON HTTP error bodies is RFC 9457 problem details. SOAP interfaces MUST declare their SOAP version, binding, faults, namespaces, and supported security arrangement instead of assuming HTTP error conventions transfer unchanged. Message contracts MUST distinguish payload schema version, delivery metadata, and the business operation's identity.

Evidence: protocol-level tests using an independent consumer. [HTTP semantics](https://www.rfc-editor.org/rfc/rfc9110.html), [problem details](https://www.rfc-editor.org/rfc/rfc9457.html), and the [SOAP messaging framework](https://www.w3.org/TR/soap12-part1/) inform the proposal; referencing SOAP 1.2 does not select it for every integration.

### INT-CONTRACT-005 — Unambiguous representations

Contracts MUST define identifiers, null/absence behavior, timestamp time zone and precision, exact numeric units/precision, enum evolution, and text encoding where applicable. Do not expose persistence entities as a contract merely because a serializer can emit them. Parser hardening remains owned by SEC-BASE-005.

Evidence: round-trip and edge-value tests, including missing/null values, boundary numbers, and timestamps across time zones.

### INT-CONTRACT-006 — Bounded collection access

Collection/bulk interfaces MUST state their maximum work/result size and, when paginated, their ordering, continuation mechanism, termination condition, and consistency expectations during concurrent changes. Unlimited exports require a separately bounded asynchronous or streaming design rather than an unbounded ordinary list call.

Evidence: tests with representative collection size and concurrent updates; document any possible missing/repeated items across pages.

## Adoption and unresolved choices

Confirm URI and naming conventions, versioning/deprecation rules, approved schema tools, protocol versions, and error extensions. Do not impose a new SOAP version on an existing external partner without compatibility review.
