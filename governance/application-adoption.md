---
{
  "id": "GOV-006",
  "title": "Application adoption",
  "type": "governance",
  "status": "draft",
  "revision": 4,
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
    "GOV-004",
    "GOV-005",
    "GOV-010"
  ],
  "requirements": [
    "GOV-APP-001",
    "GOV-APP-002"
  ],
  "requires": [
    "GOV-AUTH-001",
    "GOV-TECH-001",
    "GOV-TECH-002",
    "GOV-EXC-001",
    "GOV-EXC-002"
  ],
  "supersedes": []
}
---

# Application adoption

> Draft for Software Engineering team review. This document is not an approved standard.

## Local structure

Copy templates/application-docs/ into an application's docs/. Keep architecture, decisions/, runbooks/, compliance/, exceptions/, standards-adoption.json, and standards-lock.json locally. Link central IDs rather than copying obligations.

### GOV-APP-001 — Applicability

Each adopting application MUST record an owner, actual technologies, a workload description, a profile-selection rationale, and a pinned lock. The workload description identifies responsibilities, entry points/triggers, execution lifecycle, and state/external-effect boundaries. Select every specialized profile whose source scope matches the application's actual behavior; profiles compose additively. The workloads array contains these exact profile selectors, not a list of every possible application role. An empty application workloads array is permitted when no existing specialized profile matches, with a reviewed rationale. It does not waive shared requirements or permit omission of a matching profile. A processor is not a scheduler merely because it runs in the background.

Empty central applicability arrays mean all values in that dimension. An empty application selection has a different meaning: it selects no value. Within a nonempty central dimension, at least one selected value must intersect; when both central dimensions are nonempty, both must match. Universal and matching requirements-bearing governance/standards/technology documents, matching workload profiles, and matching technology-support-decision records seed the assessment set within the release manifest. Add their source dependencies and requirement-owner closure. Recheck the selection when responsibilities, triggers, state, or technologies change.

For each selected technology and intended use, assess all matching support records, including restrictions and prohibitions, using GOV-TECH-001 and GOV-TECH-002. Resolve their stated product/use scope before accepting a version choice; do not filter them out because the proposed version is prohibited. A missing, ambiguous, or conflicting support decision blocks the affected support/compliance claim. A draft or a support index entry cannot substitute for released authority.

Discovery indexes, roadmaps, ordinary optional ADRs/reference guides, and candidate patterns are not automatic implementation obligations. Include an ordinary pattern/decision when actually adopted or required by an applicable source; close its dependencies too. After document selection, assess each source requirement against the responsible actor/component and its conditions. Selection does not require every component to use every selected technology or satisfy another actor's duties.

### GOV-APP-002 — Evidence and upgrades

Applications MUST maintain a requirement assessment identifying the source ID, responsible actor/component, applicable scope/trigger, disposition, evidence/reference, and remaining limits. Use the dispositions below and retain accountable review of rationale, deviations, and reliance on centrally supplied evidence. Upgrade through a reviewed change: compare IDs, profiles, and support parameters, assess consumer impact, update evidence, then update the pin. A conditional requirement may be recorded as not applicable only when its source scope/trigger is absent, with a reviewed rationale and evidence of that absence. Unimplemented applicable requirements remain gaps; generated assertions do not prove compliance.

| Disposition | Required explanation and boundary |
| --- | --- |
| Satisfied | Identify observed evidence for the actual obligation, its source/configuration version, coverage, and limitations. A plan alone is not completed evidence. |
| Conditionally not applicable | Cite the absent source condition and evidence of its absence for the assessed component. This is not an exception; reassess when behavior changes. |
| Justified SHOULD deviation | Identify the SHOULD wording, rationale, consequences, alternative, evidence, and accountable review under GOV-AUTH-001. Separate MUST obligations remain in force. |
| Approved exception | Reference the actual scoped, unexpired approval under GOV-EXC-001 and GOV-EXC-002. Record compensating controls; this does not claim that the original obligation was implemented. |
| Unresolved gap | Record missing implementation, evidence, guidance, or decision; identify an owner and next action. Pending approval is a gap, not an approved exception. |

A satisfied assessment may rely on central evidence only for duties actually owned centrally, such as review of the pinned standards release. Reference the exact released record and verify that it covers the relevant duty; do not recreate or claim to grant central approval. Central approval does not prove application runtime behavior. Shared-platform evidence likewise needs a named owner, exact relevant environment/version and coverage; the application retains its own integration and operating responsibilities. Split mixed-scope requirements into component or obligation-part rows where needed rather than marking the whole requirement inapplicable.

The [application evidence template](../templates/application-docs/compliance/requirements.md) provides a starting table. It is a record of assessment, not automated proof.

## Retrieval

Use read-only private access, a submodule, or an immutable internal artifact. For local-only adoption, standards-lock.json may identify the source repository with an absolute file:/// URI; the location is machine-specific and does not replace the exact tag/commit/manifest checks. Verify from the pinned Git snapshot, not the source working tree. The repository, tag, commit, and manifest must agree. Verify document digests before discovery. If source is inaccessible or mismatched, stop dependent compliance claims and report the issue.

## Bootstrap

Application template JSON contains null pins and identity fields deliberately. It does not validate as completed adoption. Pilot application-side enforcement after an approved central release exists.

## Discovery examples and failure handling

A Python batch application selects python and batch-processor. It reads applicable universal requirements, Python conventions, and the batch profile, then follows their dependencies within its exact release. A navigation link to Angular does not add Angular requirements. If it owns no durable state, record why the persistence scope is absent; if it owns durable progress/checkpoints, evaluate that state rather than calling the application stateless.

A standalone Python processor may select python with workloads empty when it has no matching REST, SOAP, scheduling, finite batch, or message-consumption behavior. Describe its actual entry point, lifetime, state and effects, and why each potentially relevant profile does not match. The shared baseline and Python conventions still apply. A finite file-processing run may instead match batch-processor; adding a calendar trigger adds scheduler. A missing reusable pattern or support decision remains a reported gap, not a reason to invent a profile or assume approval.

For an Angular/BFF/REST application, select rest-api and the technologies actually used. For scheduled bulk work, compose scheduler and batch-processor. For a SOAP integration consuming messages, compose soap-service and message-consumer. Profiles describe behavior; they do not choose component boundaries or require a browser, broker, database, or cache where the application does not use one.

New adoption rejects deprecated guidance in the resulting closure. An existing application preserving a deprecated choice records its migration plan. If a required source is absent from the release, stop the affected adoption/compliance claim; do not substitute the draft working-tree copy. Application-side validation must implement and test these rules before claiming enforcement. The central validator checks central metadata and release closure, not consuming applications.

## Exact discovery selectors

Use exact catalog values, not shortened display labels. Current technology selectors are java, spring, angular, postgresql, python, keycloak, and valkey. Current workload selectors are rest-api, soap-service, scheduler, batch-processor, and message-consumer. Copy selectors from source applicability/catalog metadata.

Application-side checks must report an unrecognized selector or unresolved profile rather than silently omitting its guidance. A new technology or proposed specialized profile needs an explicit documented extension/support decision and applicable source coverage. An application with no matching existing profile uses the documented empty-profile route; unfamiliar behavior still requires a gap assessment and clarification where shared guidance is insufficient. This central repository does not claim to implement those application-side checks.
