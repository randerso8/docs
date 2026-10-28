---
{
  "id": "GOV-009",
  "title": "Implementation roadmap and open decisions",
  "type": "guide",
  "status": "draft",
  "revision": 8,
  "owner": "Software Engineering team",
  "classification": "internal",
  "authors": [
    "ai-assisted-bootstrap",
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
    "GOV-001",
    "GOV-002"
  ],
  "requirements": [],
  "requires": [],
  "supersedes": []
}
---

# Implementation roadmap and open decisions

> Draft for Software Engineering team review. This document is not an approved standard.

## Confirmed inputs

This is a new internal repository owned by the Software Engineering team. The user selected local-only work in the existing directory and authorized continued substantive documentation. Primary technologies are Java, Spring, Angular, PostgreSQL, Python, Keycloak, and Valkey. Workloads include REST, SOAP, schedulers, batch, and message consumers.

## Completed drafting

The foundation contains governance, templates, schemas, agent instructions, and offline validation. The first technical bundle adds architecture principles, a logical reference architecture, eight cross-cutting engineering standards, two candidate implementation patterns, and substantive workload review profiles. A further implementation bundle adds Java, Spring, and Angular conventions, a short database-work candidate, and a synthetic REST/background validation-job source pack with contract, SQL, UI/transaction mapping, and a pending runtime verification plan. A remaining-technology bundle adds Python, PostgreSQL, Keycloak, and Valkey convention drafts, a central support/version decision framework, an official-source intake index, and a reusable support decision template. The root [reading guide](../START-HERE.md) links the material in review order.

All governed documents remain drafts. There are no approved ADRs, product versions, architecture selections, or standards releases. Candidate patterns have documented verification cases but no validated reference implementation yet.

## Coherence amendments for review — 2026-10-28

The first independent-review follow-up proposes a shared-baseline route for applications with no matching specialized profile, explicit discovery of support parameter decisions, and clearer requirement/evidence dispositions. The adoption schema now requires a workload description and profile-selection rationale while permitting an empty specialized-profile selection. The support-decision template has a distinct metadata type; its parameter values remain governed by the existing support requirements. Application evidence templates and targeted evidence examples are aligned.

These are draft amendments for Software Engineering review, not accepted policy or approved application choices. Confirm the empty-profile safeguards, parameter authority/discovery model, and accountable review of evidence/deviations. Task-specific reading paths, navigation vocabulary, application agent/reporting instructions, and a broader application-responsibility map are now drafted. Representative walkthroughs cover frontend/BFF/API, standalone processing, scheduled/restartable batch, and integration/message consumption without choosing application designs. External-document reconciliation and application migration planning remain separate work.

## Local approval and release readiness

The hosted-only evidence assumption has been replaced by a tested [local review/release workflow](local-review-and-release.md). It supports roster-bound delegation, human attestations, unsigned candidates, approval application, approved closure, and independent release review. Real identities/delegation, content review, local custody/backups, and activation still require accountable team decisions. The actual repository remains bootstrap with no approvals or approved release.

## Decisions to resolve through review

| Decision | Owner | When needed |
| --- | --- | --- |
| Necessary/proportionate proposed engineering requirements | Software Engineering | First technical review |
| Real reviewer delegation, human evidence, and activation | Software Engineering | Before formal approval/release; tooling is implemented |
| Review cadence and adoption deadlines | Software Engineering | Governance approval; initial proposal is six months |
| Supported runtime/product versions and compatibility | Software Engineering | Before version-specific implementation guidance |
| Deployment, service objectives, and recovery targets | Software Engineering | Before an application topology is selected |
| Browser/session design, identity trust, and tenant model | Software Engineering | Before identity patterns are approved |
| Messaging product and delivery/ordering semantics | Software Engineering | Before broker-specific consumer implementation |
| Valkey use cases, persistence, and consistency needs | Software Engineering | Before cache/locking/session patterns |
| Pilot application and real business scenario | Software Engineering | Before validating a reference implementation |
| Optional private hosting | Software Engineering | Only if the user later chooses it |

## Decision scope before reconciliation

| Topic | Central documentation responsibility | Application responsibility | Team input still needed |
| --- | --- | --- | --- |
| Workload selection and evidence | Shared applicability, no-match safeguards, disposition and evidence rules | Actual behavior, component conditions, reviewed rationale, observed evidence and gaps | Confirm the proposed rules and accountable review expectations |
| Support and technology choices | Approved support parameters and compatibility/update policy for intended uses | Exact selected inputs and evidence that the actual combination fits | Select supported combinations from real evidence; no versions are approved yet |
| Capability and application structure | Shared boundary criteria and reusable role guidance | Actual capability ownership, topology, contracts and local ADRs | Confirm reusable expectations without imposing one topology or folder layout |
| Identity, data and operations | Shared trust/security/data/recovery obligations and any reviewed common service policy | Actual identity propagation, data/effect boundaries, objectives, operators and integration evidence | Assign shared versus application responsibility where arrangements are unresolved |
| Authority and maintenance | Requirement ownership, real delegation, review/release process, versioning and exceptions | Exact pins, local assessment, exception records and upgrade evidence | Delegate real reviewers, review content and custody, and authorize any future activation |

An open application-specific choice is not automatically a missing central policy. A shared requirement or conflicting common decision needs central resolution; local choices within the baseline belong with the application. Agents may propose wording and options but cannot supply the team's decisions or evidence.

## Next technical stages

1. Review the coherence amendments, task routes, and proposed responsibility map against the four representative situations. Confirm source authority, applicability, proportional evidence, and when clarification is required.
2. Perform focused reviews of architecture/language/framework boundaries; security/identity/Keycloak; reliability/data/PostgreSQL/patterns; contracts/SOAP/consumers; Angular interaction; and delivery/observability/support/recovery. Review actual source owners, not only profile summaries.
3. When existing engineering documents are supplied, map their terminology and obligations to existing owners, identify conflicts and provenance, and propose source amendments without duplicating authority. Angular reconciliation is one part of this work. Do not infer the contents of unavailable documents.
4. Establish real reviewer delegation and authorized local custody for formal review. Use the [support framework](technology-support.md) and [intake index](../technologies/support-status.md) for product choices with actual compatibility/support evidence. Release or activation remains a separately authorized human action.
5. Later, select representative isolated pilots to validate candidate patterns and their failure boundaries. The validation-job fixture is one candidate, not the mandatory first application or proof of coverage for other workloads. Approve reusable patterns only after reviewable implementation and failure evidence exists.

Application migration planning and implementation remain separate from these documentation passes. No pilot, migration, external-document integration, or runtime validation has been performed by this drafting work.

No additional hosting work is needed to continue drafting.

## Navigation and authority

Links here are a reading/progress index, not additional implementation obligations or approval prerequisites. Resolve actual source dependencies and lifecycle through the catalog and pinned release. A linked draft remains draft.

## Self-audit before human review

The [2026-10-24 self-audit](../reviews/audits/2026-10-24/README.md) reviewed all governed sources in bounded tasks, corrected documented findings, and retained explicit runtime/adoption limits. It does not replace independent team review or activate the repository.
