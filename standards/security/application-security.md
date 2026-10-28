---
{
  "id": "STD-002",
  "title": "Application security baseline",
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
    "GOV-001",
    "GOV-003",
    "ARC-002"
  ],
  "requirements": [
    "SEC-BASE-001",
    "SEC-BASE-002",
    "SEC-BASE-003",
    "SEC-BASE-004",
    "SEC-BASE-005",
    "SEC-BASE-006",
    "SEC-BASE-007"
  ],
  "requires": [],
  "supersedes": []
}
---

# Application security baseline

> Draft for Software Engineering team review. These are proposed requirements and guidance, not an approved standard.

## Scope and ownership

Apply this baseline to deployed application behavior and its runtime dependencies, including internal services and background workloads. Documentation handling remains owned by [internal information handling](../../governance/information-handling.md); application security obligations are owned here. Identity controls are selected from the separate identity standard.

### SEC-BASE-001 — Threat and trust model

Each application MUST record assets, entry points, trust boundaries, privileged operations, plausible abuse, and mitigations before production use. Revisit the model when identity, exposure, data classification, or integrations materially change. Record accepted residual risks through accountable review.

Evidence: a concise threat model connected to architecture views and security tests. OWASP describes threat modeling as a review of design, threats, mitigations, and their adequacy. [OWASP threat modeling](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html).

### SEC-BASE-002 — Bounded input processing

Application-controlled entry points MUST validate input structure and business constraints before use, including HTTP, SOAP, messages, files, job parameters, and externally sourced configuration. Bound payload size, collection count, nesting, decompression, and processing cost as appropriate. Define rejected-input behavior. Internal-network origin does not make input trusted.

Evidence: negative cases for malformed, oversized, unexpected, and semantically invalid inputs, including bypass of browser-side validation.

### SEC-BASE-003 — Runtime secret management

Runtime credentials and cryptographic keys MUST come from an approved protected source, have an owner and rotation/revocation process, and be scoped to the runtime's purpose. Browser-delivered code cannot hold a confidential-client secret. General application configuration identifies secret references rather than embedding live secret values.

Evidence: a configuration inventory using references and a demonstrated credential replacement process without exposing secret material.

### SEC-BASE-004 — Protected transport and endpoint trust

Connections crossing runtime trust boundaries with credentials or sensitive information MUST use authenticated encrypted transport, verify the intended peer, and document TLS termination and any remaining plaintext segment. Unauthenticated encryption or disabling certificate/hostname checks is insufficient. Any proposed plaintext sensitive hop needs explicit risk review before approval.

Evidence: a connection/trust diagram and negative tests for an untrusted peer. Specific protocol and certificate policies remain a separately reviewed deployment choice.

### SEC-BASE-005 — Safe platform features

Applications MUST retain framework output encoding and safe parser protections. Changes that bypass them need an explicit security rationale and tests. XML processing rejects unnecessary DTDs and external entities, with any permitted schema resolution limited to trusted resources. Do not deserialize arbitrary runtime types from untrusted data or build executable templates from external input.

Evidence: malicious input tests at the actual parser/rendering boundary. See [OWASP XML protection](https://cheatsheetseries.owasp.org/cheatsheets/XML_External_Entity_Prevention_Cheat_Sheet.html) and [Angular security guidance](https://angular.dev/best-practices/security).

### SEC-BASE-006 — Least-privileged runtime access

Runtime identities MUST have only the filesystem, network, database, broker, and administrative permissions required by their workload. Separate normal application execution from schema ownership, administrative maintenance, and unrelated application identities. Declare any shared operational identity and its justification.

Evidence: a permission matrix and tests showing the runtime cannot perform a representative out-of-scope operation.

### SEC-BASE-007 — Controlled disclosure

Responses, telemetry, diagnostic dumps, and audit records MUST exclude credentials, session/access tokens, private keys, and unnecessary sensitive payloads. Define safe error fields, redaction, access, and retention according to application data classification. Record enough safe context for investigation without copying full request bodies or authentication material by default.

Evidence: canary-sensitive-data tests covering failure paths, exception messages, exporters, and support diagnostics.

## Adoption and open decisions

These requirements propose controls, not an ASVS certification level or a completed threat assessment. Confirm organization data categories, approved secret sources, security response ownership, and deployment transport rules. Use synthetic evidence while those decisions are pending.

## References

Public sources checked on 2026-10-23. These inform the proposal; they do not approve organization policy or select product versions.

- [OWASP Application Security Verification Standard](https://asvs.owasp.org/)
- [OpenTelemetry sensitive-data handling](https://opentelemetry.io/docs/security/handling-sensitive-data/)
