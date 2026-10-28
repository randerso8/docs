---
{
  "id": "TECH-010",
  "title": "Angular application conventions",
  "type": "technology",
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
    "technologies": [
      "angular"
    ],
    "workloads": []
  },
  "required_approvals": [
    "engineering",
    "security"
  ],
  "approvals": [],
  "depends_on": [
    "ARC-002",
    "STD-002",
    "STD-003",
    "STD-005",
    "STD-008"
  ],
  "requirements": [
    "ANG-APP-001",
    "ANG-APP-002",
    "ANG-APP-003",
    "ANG-APP-004",
    "ANG-APP-005",
    "ANG-APP-006",
    "ANG-APP-007"
  ],
  "requires": [
    "INT-CONTRACT-002",
    "IAM-CORE-002",
    "TEST-EVID-003"
  ],
  "supersedes": []
}
---

# Angular application conventions

> Draft for Software Engineering team review. Proposed guidance; no formal approval or runtime certification is implied.

## Applicability

Apply to Angular browser applications. Supported Angular/TypeScript/Node versions, UI toolkit, server rendering, state library, and session/BFF versus bearer-token design remain decisions. Shared security and identity requirements remain owned by their source standards; client UI behavior cannot establish server authorization.

### ANG-APP-001 — Feature-centered responsibilities

Angular code MUST group related behavior by feature/capability, with a clear entry point and narrow shared interfaces. Components focus on presentation and interaction; feature data-access/application code coordinates remote work and state as complexity warrants. Avoid a global collection of unrelated services, helpers, and components. Keep small features compact rather than generating an empty hierarchy.

Evidence: trace one user interaction through a feature and identify its reusable public boundary. [Angular style guidance](https://angular.dev/style-guide) informs organization.

### ANG-APP-002 — Explicit asynchronous UI state

Remote workflows MUST model loading/submitting, useful empty data, success, expected errors, unknown mutation outcome, and stale results where relevant. State transitions distinguish local request failure from confirmed server rejection and distinguish pending work from completed work. Define which result wins when requests complete out of order; a stale response must not replace the newly selected resource.

Evidence: rapid navigation/selection, late responses, failed submission after possible server commit, and recovery without duplicating the user's intent.

### ANG-APP-003 — Typed and validated HTTP boundaries

Feature HTTP boundaries MUST translate contract payloads into deliberate types and handle malformed or unexpected data according to the contract's evolution policy. A TypeScript type argument on HttpClient is not runtime validation. Choose generated types and/or maintained runtime validation where justified; do not reproduce an entire business domain validator in the browser as a substitute for server rules.

Evidence: expected, missing, malformed, and unknown-field responses plus a contract compatibility check. INT-CONTRACT-002 owns consumer compatibility. [Angular request typing](https://angular.dev/guide/http/making-requests) explains the difference between a type assertion and runtime verification.

### ANG-APP-004 — Owned subscriptions and polling

Subscriptions, timers, listeners, and polling MUST have an explicit owner, termination condition, and cleanup tied to the relevant feature/component lifecycle. Use framework-supported teardown and appropriate stream composition. Stopping an HTTP subscription or leaving a page does not prove that accepted server work was canceled. Polling is bounded by an agreed policy and stops on terminal state or explicit pause.

Evidence: navigate away during a poll, switch resources, destroy the owning component, and observe cleanup and correct late-result behavior. [Angular lifecycle](https://angular.dev/guide/components/lifecycle).

### ANG-APP-005 — Usable accessible interaction

Interactive UI MUST use meaningful semantic controls, associated labels, keyboard access, visible focus, and perceivable validation/status feedback. Manage focus and status announcements for route/dialog/async changes when needed. Do not represent essential status only by color or an unlabeled spinner. The organization-wide accessibility target still needs explicit review.

Evidence: keyboard walkthrough and targeted accessibility checks for forms and asynchronous job status. [Angular accessibility guidance](https://angular.dev/best-practices/a11y).

### ANG-APP-006 — Scoped client authentication behavior

HTTP authentication integration MUST attach credentials only to explicitly trusted configured destinations and handle authentication failure through the chosen session design. An interceptor cannot blindly attach a bearer token to every URL, including an arbitrary Location supplied in a response. Route guards guide navigation; IAM-CORE-002 owns server-side authorization. Do not disable applicable browser protections merely to make requests succeed.

Evidence: trusted and untrusted destinations, redirects/poll targets, logged-out state, and a guarded route tested against a server denial. [HTTP interceptors](https://angular.dev/guide/http/interceptors) and [route-guard limits](https://angular.dev/guide/routing/route-guards).

### ANG-APP-007 — User-observable feature evidence

Angular tests MUST cover meaningful rendered interaction and feature state, not just class construction or a stub returning its configured value. Use HTTP/router/component testing support to examine requests, responses, navigation, teardown, and safe failure presentation. A frontend mock does not verify a real identity provider or backend access rule; include the representative contract/integration evidence required by TEST-EVID-003.

Evidence: relevant rendered interactions and feature states, such as submit/poll/success when the feature submits and polls, denied access where protected, malformed response, unknown mutation outcome, stale response, and teardown where those behaviors exist. A feature without polling does not need a polling workflow to supply evidence. [Angular HTTP testing](https://angular.dev/guide/http/testing).

## Candidate feature layout

```text
src/app/validation-jobs/
  validation-jobs.routes.ts
  pages/validation-job-page/
  data-access/validation-jobs-api.ts
  data-access/validation-job-state.ts
  ui/validation-job-status/
```

These responsibility folders sit inside a feature; they are not global silos. File suffixes and exact standalone/provider APIs should match the selected Angular version and team conventions. The [worked example](../../architecture/reference-architectures/validation-job-example.md) explores how this feature handles server-side background work.

## Decisions before adoption

Select version compatibility, rendering model, UI/accessibility target, session design, state conventions, runtime validation, and bounded polling/retry behavior. Existing applications need an explicit migration plan rather than an automatic broad rewrite.
