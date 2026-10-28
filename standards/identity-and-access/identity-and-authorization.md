---
{
  "id": "STD-003",
  "title": "Identity and authorization",
  "type": "standard",
  "status": "draft",
  "revision": 2,
  "owner": "Software Engineering team",
  "classification": "internal",
  "authors": [
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
    "engineering",
    "security"
  ],
  "approvals": [],
  "depends_on": [
    "ARC-002",
    "STD-002"
  ],
  "requirements": [
    "IAM-CORE-001",
    "IAM-CORE-002",
    "IAM-CORE-003",
    "IAM-CORE-004",
    "IAM-CORE-005",
    "IAM-CORE-006"
  ],
  "requires": [],
  "supersedes": []
}
---

# Identity and authorization

> Draft for Software Engineering team review. These are proposed requirements and guidance, not an approved standard.

## Scope

Apply to human users, service callers, schedulers, batch jobs, and message consumers. Internal deployment is not an authentication mechanism. Keycloak is in technology scope, but realm design, product version, and a universal browser-session architecture remain undecided. Runtime secrets and safe disclosure are owned by the [security baseline](../security/application-security.md).

### IAM-CORE-001 — Explicit trusted identity

Protected operations MUST identify the principal, authentication mechanism, trusted issuer/authority, and identity propagation boundary. A caller-supplied username, role header, browser flag, or unsigned message field is not authenticated identity. Anonymous operations are explicit allowlisted exceptions in the application's access model.

Evidence: an entry-point identity matrix and tests that reject forged identity assertions.

### IAM-CORE-002 — Resource-level authorization

Protected actions MUST enforce authorization on the server for the requested operation and resource, including tenant and ownership boundaries where applicable. Default to denial when no rule authorizes access. Hiding a browser control does not enforce authorization. A valid identity does not imply permission to every object.

Evidence: permitted and denied cases for cross-user/cross-tenant access, privileged operations, and indirect references.

### IAM-CORE-003 — Token and assertion validation

Token-consuming components MUST use maintained protocol libraries and validate the token/assertion type, trusted authority, intended audience, lifetime, and cryptographic validity or authoritative introspection result. JWT consumers constrain allowed algorithms and use keys from configured trusted issuers; untrusted token content cannot choose a new trust source. ID tokens are not substituted for API access tokens.

Evidence: rejection of tampered, expired, wrong-audience, wrong-issuer, and wrong-token-type inputs, plus tested key rotation. [JWT security practice](https://www.rfc-editor.org/rfc/rfc8725.html) and [OAuth token audience guidance](https://www.rfc-editor.org/rfc/rfc9700.html) inform these checks.

### IAM-CORE-004 — Reviewed interactive authentication

An application using OAuth/OIDC for interactive login MUST use an explicitly reviewed flow and browser/session design. The proposed default is authorization code with PKCE. Resource-owner password grants and implicit delivery of access tokens are excluded from the proposed baseline. Record redirect restrictions, login CSRF protections and protection of state-changing requests when browsers automatically attach credentials, logout, token exposure, and the choice between a browser token client and a backend session/BFF. The browser design decision is not settled by choosing Angular or Keycloak.

Evidence: a login/session sequence and negative tests for redirect manipulation, state/nonce handling as applicable, and session misuse. [OAuth security best current practice](https://www.rfc-editor.org/rfc/rfc9700.html).

### IAM-CORE-005 — Workload identity and delegation

Unattended work MUST use a dedicated service/workload identity with least-privileged permissions. Document whether a downstream action uses that workload's authority or explicit delegation from a user. Do not retain a user's interactive token as a general-purpose scheduler credential. Preserve safe audit attribution without forwarding reusable credentials unnecessarily.

Evidence: a workload permission map and tests distinguishing operator initiation from execution authority.

### IAM-CORE-006 — Credential lifecycle and failure behavior

Applications MUST document credential/key rotation, trust-cache policy, revocation limitations, and behavior when identity infrastructure is unavailable. Invalid or unverifiable identity cannot become an allow decision. Previously trusted cached verification material can be used only within an explicit validated policy; provider unavailability does not itself justify bypassing checks.

Evidence: outage and rotation tests, including unknown keys, expired trust material, and recovery.

## Decisions before approval

Confirm identity provider responsibility, tenant model, privileged-access policy, allowed grants, browser architecture, and revocation expectations. Use standard ecosystem protocol support where possible; Keycloak's documentation describes its integration options without establishing our realm configuration. [Keycloak application security planning](https://www.keycloak.org/securing-apps/overview).

## Adoption

Map each protected entry point to these IDs and its tests. Retain actual realm/client policy and environment-specific details in the application repository, with safe references to restricted configuration.
