---
{
  "id": "GOV-010",
  "title": "Technology support and version decisions",
  "type": "governance",
  "status": "draft",
  "revision": 3,
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
    "engineering",
    "security"
  ],
  "approvals": [],
  "depends_on": [
    "STD-009",
    "GOV-001",
    "GOV-002",
    "GOV-004",
    "GOV-005"
  ],
  "requirements": [
    "GOV-TECH-001",
    "GOV-TECH-002",
    "GOV-TECH-003",
    "GOV-TECH-004",
    "GOV-TECH-005"
  ],
  "requires": [
    "DEL-BUILD-001",
    "DEL-BUILD-002",
    "GOV-AUTH-001",
    "GOV-LIFE-001",
    "GOV-REL-002",
    "GOV-REL-003",
    "GOV-EXC-001"
  ],
  "supersedes": []
}
---

# Technology support and version decisions

> Draft for Software Engineering team review. Proposed guidance; no formal approval, supported product selection, or runtime certification is implied.

## Purpose and authority

Define how the Software Engineering team makes central technology support decisions for multiple application repositories. This document owns the obligations to establish, resolve, and apply support policy. Support decisions supply the parameter values those obligations delegate; they own no new normative requirement IDs. DEL-BUILD-001 and DEL-BUILD-002 continue to own application build inputs and dependency management. Product versions have not been selected. The [support intake index](../technologies/support-status.md) points to sources and future decisions; it is not an independent approval table.

### GOV-TECH-001 — One accountable support decision

Each centrally supported product/distribution and intended role MUST have one authoritative reviewed decision under architecture/decisions/, using the [technology support decision template](../templates/technology-support-decision.md). Use metadata type technology-support-decision and an ARC document ID so consumers can discover these records independently of optional architecture decisions. Declare each affected technology selector; use empty workload applicability when a restriction applies across workload types. State product/use conditions in the body, including how mixed component roles are assessed. Identify the owner, distribution/provider, allowed release constraints, exact tested patch/builds, intended use, scope, support classification, evidence, and update responsibility. A decision may group tightly coupled products when their boundaries stay explicit. Overlapping decisions must state precedence or supersession; a discovery table or source URL cannot create a second support authority.

Evidence: reviewers can resolve a product/use to one applicable decision and the requirements it constrains. GOV-AUTH-001 owns single source authority.

### GOV-TECH-002 — Separate support classification from document lifecycle

A support decision MUST distinguish its governance status from the support classification it proposes. Until the decision is approved and included in an applicable approved standards release, treat its product/version choice as candidate/unapproved. Within an approved decision, use preferred (default for the stated use), permitted (allowed alternative), restricted (only stated conditions), retiring (migration/deadline defined), or prohibited (not allowed in the stated scope). Applications MUST resolve and apply the applicable released support parameters for their actual product/distribution, role, and version before claiming a supported choice. Include matching restricted and prohibited records in that assessment; a version outside the allowed constraints is not a reason to omit the record. Missing support coverage is unresolved, not implicit permission. State the scope and reason; these labels do not approve deployment or guarantee vendor support. GOV-LIFE-001 and GOV-REL-002 own lifecycle and released authority.

Evidence: a consumer can distinguish a draft recommendation, an approved permitted alternative, a retiring existing pin, and a prohibited new adoption. No product is assigned an approved support classification by this document.

### GOV-TECH-003 — Compatible combinations and bounded patch policy

Decisions MUST state supported compatibility combinations and how evidence covers them: runtime, framework, compiler/build inputs, database/server/driver, client/library, topology, extensions, and relevant native/platform constraints. A version range needs an explicit patch/minor update policy and triggers for fresh validation; it is not permission for uncontrolled upgrades. Record exact tested versions and material gaps. Applications still pin exact resolved inputs under DEL-BUILD-001 and DEL-BUILD-002. A constrained central policy need not manually list every patch if its allowed updates and evidence obligations are unambiguous.

Evidence: a compatibility table plus a representative update rehearsal and test scope. For example, review Java/JDK/Spring together and Angular/Node.js/TypeScript/RxJS together; review Python native builds and PostgreSQL drivers/extensions when used. Review Keycloak database/runtime/extensions and Valkey client/topology compatibility rather than treating a server number as the whole system.

### GOV-TECH-004 — Dated support evidence and coverage

Decisions MUST cite official lifecycle/compatibility sources with the date checked, relevant edition/distribution, support phase/end information if known, and the coverage actually available to the organization. Distinguish community maintenance, vendor distribution support, and paid support entitlement. Unknown support dates or entitlements remain explicit unknowns; do not invent end dates or infer one vendor's Java LTS terms apply to every JDK. Assign a review date and earlier review triggers for security findings, upstream policy changes, end-of-support notices, or incompatible dependency updates.

Evidence: another reviewer can reproduce the support assessment and identify unresolved coverage. A latest download or passing build alone is insufficient support evidence. No universal update SLA or purchased entitlement is assumed here.

### GOV-TECH-005 — Retirement, exceptions, and consumer migration

A change that restricts or removes supported choices MUST identify affected consumers/profiles, migration path, risk, accountable owner, and applicable adoption deadline. Use GOV-REL-003 for standards compatibility and GOV-EXC-001 for scoped time-bounded exceptions. Preserve old released snapshots/pins; do not silently rewrite history or make old records falsely appear to approve the new choice. A new support decision does not itself demonstrate an application's upgrade or grant an exception.

Evidence: a retiring-choice example with consumer impact, compatible replacement, migration checks, and a recorded decision for any unresolved deadline. Deadlines depend on actual risk/support evidence and human approval, not invented blanket periods.

## Discovery and parameter authority

Support decisions remain ADRs in purpose, but have the distinct metadata type technology-support-decision for reliable discovery. They declare GOV-010 as a dependency and reference the five owning support requirements. Their requirements array stays empty. Ordinary architecture-decision records remain optional unless adopted or required by another applicable source.

Within an application's pinned release, technology/workload applicability identifies candidate support records; the body then resolves distribution, role, version, and other stated conditions. All matching restrictions participate. Supersession or explicit scoped precedence must resolve overlapping records to one effective parameter set for a product/use; unresolved overlap blocks the affected claim. Merely preferring one alternative or locating a newer draft does not supersede a released restriction.

An exception to a support restriction identifies the owning requirement, the support decision ID and released digest, and the exact product/use/version constraint being relaxed. It follows GOV-EXC-001; a local ADR or a satisfied build cannot authorize it. Parameter changes remain subject to GOV-TECH-005 and GOV-REL-003 even though the decision owns no new requirement IDs.

## Local drafting workflow

1. Select an actual application use and assemble the compatibility/support evidence in the decision template.
2. Compare credible alternatives, including operational cost and security constraints; keep unknowns visible.
3. Run a representative isolated pilot and record exact inputs, evidence, and limitations in application documentation.
4. Review through the existing document lifecycle and include approved dependency closure in a future release.
5. Refresh the intake links and consumer adoption records after the accountable decision.

The repository currently has no approved decisions or standards release. The [local workflow](local-review-and-release.md) supports approval evidence and release validation; real reviewer delegation, review, and activation remain pending in the [roadmap](implementation-roadmap.md). Source research and draft writing can continue locally. Agents can prepare and check decisions, but cannot supply human approval.
