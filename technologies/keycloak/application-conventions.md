---
{
  "id": "TECH-013",
  "title": "Keycloak application conventions",
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
      "keycloak"
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
    "STD-003",
    "STD-002",
    "GOV-003",
    "STD-007"
  ],
  "requirements": [
    "KC-IDP-001",
    "KC-IDP-002",
    "KC-IDP-003",
    "KC-IDP-004",
    "KC-IDP-005",
    "KC-IDP-006",
    "KC-IDP-007"
  ],
  "requires": [
    "IAM-CORE-002",
    "IAM-CORE-004",
    "IAM-CORE-005",
    "IAM-CORE-003",
    "SEC-BASE-004",
    "SEC-BASE-006",
    "IAM-CORE-006",
    "GOV-INFO-002",
    "OBS-OPER-005",
    "GOV-INFO-001"
  ],
  "supersedes": []
}
---

# Keycloak application conventions

> Draft for Software Engineering team review. Proposed guidance; no formal approval, supported product selection, or runtime certification is implied.

## Applicability and authority

Apply when Keycloak issues or manages identities used by an application. [Identity and authorization](../../standards/identity-and-access/identity-and-authorization.md) owns trust, flow, token-validation, and resource-authorization requirements. This document adds Keycloak configuration and operating conventions. Realm layout, tenant mapping, browser session design, adapters, and hosting remain decisions to review, not defaults inferred from examples.

### KC-IDP-001 — Realm and client responsibility boundaries

A Keycloak design MUST identify environments, realms, clients, owners, authentication boundaries, and how application principals/tenants map to them. Classify public browser clients separately from confidential server clients and dedicated workload identities. Keep application runtime, configuration automation, and administrative identities distinct according to their actual privileges. A realm role or client registration alone does not establish application resource authorization under IAM-CORE-002.

Evidence: realm/client/context diagram and representative user/workload request mapping. Do not assume one realm per application or one realm per tenant without comparing operational and isolation consequences.

### KC-IDP-002 — Deliberate client flows and endpoint allowlists

Every Keycloak client MUST have reviewed enabled grants/flows, redirect URIs, web origins, logout destinations, authentication method, and client/session settings. Disable unused capabilities. Apply IAM-CORE-004 to interactive flow selection and IAM-CORE-005 to workload identities; do not enable password grants or implicit access-token delivery as an incidental compatibility shortcut. Use explicit narrow endpoint allowlists appropriate to the chosen integration and test rejection paths.

Evidence: redacted configuration diff, authorized redirect/origin case, rejected redirect/origin case, and denied unused grant. The [server administration guide](https://www.keycloak.org/docs/latest/server_admin/index.html) describes client, scope, and session configuration; verify setting names/behavior for the selected release.

### KC-IDP-003 — Scoped claims, audiences, and role mapping

Keycloak configuration MUST document client scopes, protocol mappers, emitted audiences, role/group mapping, and the application's interpretation of relevant claims. Request only necessary claims and permissions. Ensure the service receives the expected audience and validates it under IAM-CORE-003; never infer authorization from an arbitrary role name or from a token merely being signed by the realm. Define how privilege changes propagate to consumers.

Evidence: synthetic claim-shape examples and consumer tests for incorrect audience, missing permission, stale role state, and unauthorized resource access. Record claim names/expected values without committing actual access, ID, refresh, or offline tokens. The [administration guide](https://www.keycloak.org/docs/latest/server_admin/index.html) documents audience mappers and client scopes.

### KC-IDP-004 — Stable issuer and trusted proxy configuration

Deployment MUST explicitly define the externally trusted hostname/issuer, TLS termination path, accepted forwarded headers and trusted proxy boundaries. Prevent untrusted request headers from selecting a fraudulent public issuer or redirect endpoint. Separate administration/management exposure from required application-facing endpoints; select health/metrics access deliberately. SEC-BASE-004 and SEC-BASE-006 own transport and privilege requirements.

Evidence: issuer/discovery checks from the consumer network, hostile forwarded-header tests, and management-endpoint access checks. See [hostname configuration](https://www.keycloak.org/server/hostname) and [reverse proxy guidance](https://www.keycloak.org/server/reverseproxy).

### KC-IDP-005 — Key, token, and session lifecycle behavior

The integration MUST specify signing-key rotation, consumer key-cache refresh, session/token/refresh lifetimes, permitted offline access, and effects of logout, account disablement, or permission changes. Bound offline access explicitly when used. Document whether APIs validate self-contained tokens locally, use introspection, or apply another reviewed revocation check, and the resulting delay/outage behavior. Do not promise that ending a Keycloak session instantly invalidates every already-issued token accepted by an offline consumer. IAM-CORE-006 owns credential lifecycle and dependency-outage policy.

Evidence: rotation across old/new keys, expired token, logout/disablement, refresh rejection, and identity-provider outage cases on the actual integration. Review [session and offline-access configuration](https://www.keycloak.org/docs/latest/server_admin/index.html) for the selected release.

### KC-IDP-006 — Controlled configuration, upgrades, and database recovery

Keycloak configuration changes MUST be reviewable and reproducible using a selected supported mechanism, with secrets supplied through approved runtime references and drift detection appropriate to that mechanism. Keep real realm exports, user exports, and environment-resolved secrets out of this repository under GOV-INFO-001. Evaluate import/export limitations before treating an export as a recovery artifact. Upgrade plans must include database/schema compatibility, configuration/themes/extensions, session impact, and a tested restore/forward-fix path; replacing the binary alone is not a general database rollback strategy.

Evidence: sanitized configuration change and drift review, representative upgrade rehearsal, and recovery exercise. See [import/export cautions](https://www.keycloak.org/server/importExport) and the current [upgrade preparation guidance](https://www.keycloak.org/docs/latest/upgrading/index.html). The latter requires restoring compatible installation/database state when database migration must be rolled back; verify supported rolling-update paths for the exact release pair.

### KC-IDP-007 — Delegated administration and audit recovery

Keycloak administration MUST use scoped roles/service accounts with accountable ownership, safe bootstrap/break-glass handling, and reviewable administrative events. Define how emergency access is stored, exercised, revoked, and audited without placing credentials here. Identify restore responsibilities for the identity database, necessary configuration, keys/secrets, and external federation dependencies. Administrative automation must not reuse an application's runtime credential for convenience.

Evidence: denied administrative action from an application identity, an authorized scoped change with audit evidence, and a synthetic break-glass/restore rehearsal. OBS-OPER-005 owns investigation/audit needs; GOV-INFO-001 prohibits restricted audit/identity records here; GOV-INFO-002 governs the authorized systems used for them.

## Review pack and open choices

Review the realm/client map, permitted flows, synthetic claim contract, issuer/proxy path, token/session policy, delegated administration, and upgrade/restore plan together with the application. Authentication and Keycloak configuration do not move ownership of business authorization out of the application. Consult the [support decision framework](../../governance/technology-support.md) before selecting releases, adapters, or extension APIs.

Official references checked on 2026-10-23. Reference editions and moving documentation pages do not select an approved runtime version. Recheck the documentation for the version actually selected. Requirements above are proposed team conventions.
