# Standards changelog

## Unreleased task navigation and responsibility guidance — 2026-10-28

Expanded START-HERE.md with balanced task routes, vocabulary, authority boundaries, bounded-task retrieval, and evidence reporting. Updated central/application agent instructions and the application architecture template. ARC-003 now distinguishes frontend, BFF, business API, integration, standalone processor, scheduler, batch, and consumer responsibilities; it explains state/effect and operating boundaries with four conceptual review walkthroughs. ARC-001 and GOV-007 link the expanded guidance. GOV-009 separates central versus application decisions, focused reviews, later reconciliation, and future pattern validation.

No new normative requirement IDs, universal application design, product choices, or approved patterns are introduced. ARC-003 declares the actual source requirements it uses; navigation links do not become extra release prerequisites. All amended governed sources remain drafts. Application migration planning, unavailable-document reconciliation, implementation pilots, and formal human approval remain outside this drafting change.

## Unreleased coherence amendments — 2026-10-28

Draft follow-up to the independent overall review. Clarified GOV-AUTH-001/002, GOV-APP-001/002, GOV-DOC-001, GOV-TECH-001/002, and TEST-EVID-001: specialized profiles follow actual behavior, no-match selections retain the shared baseline, support ADRs supply parameters under owned requirements, and evidence dispositions distinguish proof, conditional absence, SHOULD deviation, exception, and gap. Targeted Spring, Angular, and observability evidence examples no longer imply a universal database/worker/polling topology. Existing requirement IDs and owners are preserved.

Bootstrap format changes: adoption records require workload_description and profile_selection_rationale and may have an empty workloads array; support ADRs use metadata type technology-support-decision. Existing draft adoption records need the two explanations, and any draft support ADR must use the designated type and declared support dependencies. No approved release or approved support decision exists to migrate. Central validation checks document metadata; consuming-application discovery and evidence enforcement still require application-side implementation and review.

All amended governed documents remain draft, with revised dates/revisions. No reviewer identities, approvals, product choices, repository activation, or release authority are created. Broader task navigation, application-role guidance, and supplied-document reconciliation remain follow-up work.

## Unreleased self-audit corrections — 2026-10-24

Reviewed all 49 governed drafts and 125 proposed requirements in 15 bounded tasks; corrected 13 recorded findings. Navigation links no longer inflate approval/release dependency closure. Clarified source-based applicability, exact selectors, conditional non-applicability, deprecated adoption, minimal work identifiers, retired history, and request-level CSRF behavior. Proposed requirement clarifications affect GOV-AUTH-002, GOV-INFO-001, GOV-REL-002, GOV-APP-001, GOV-APP-002, and IAM-CORE-004; stable IDs and source ownership remain intact.

Added ten audit regressions for review revision/role protection, retained history, nested source scanning, metadata preparation, release pointer format, and HTTP authentication challenges. Full suite: 56 passing tests. Example structure now checks declared 401 challenges and has 25 local JSON references; full runtime verification remains pending. The [audit record](../reviews/audits/2026-10-24/README.md) records coverage, fixes, sources, and limits. All content remains draft; no actual approval, activation, release, commit/tag, remote, or hosting action was created by the audit.


## Unreleased local review and release workflow — 2026-10-23

Added GOV-011 operating guidance, review-record schema/template, local review/release helpers, reviews/ evidence storage, and rejection/integration tests. Draft amendments to GOV-LIFE-001 and GOV-004 replace the hosted-only approval/release assumption with explicitly selected local or hosted evidence. The original URL-only requirement conflicted with the user's local-only direction; digest-bound local attestations provide reviewable evidence without inventing hosting, while human identity/custody remain externally verified. GOV-002 and GOV-004 now propose engineering/security review coverage.

Bootstrap format changes: repository configuration requires review mode; manifests require authors for independent release review; approval evidence accepts mode-checked local references; application locks accept absolute file URIs. Committed review records receive baseline immutability checks. No approved history or released consumer format was overwritten. All governed sources remain draft, roles remain empty, phase remains bootstrap, and no real approvals, releases, commits, tags, remote, or scheduled tasks were created by this bundle.

## Unreleased remaining-technology guidance — 2026-10-23

Added TECH-011 through TECH-014 with 29 proposed Python, PostgreSQL, Keycloak, and Valkey requirements. Added GOV-010 with five support-decision requirements, GUIDE-002 with dated official-source intake links, and a support-decision ADR template. Updated the four scope pages, technology discovery, reading guide, and roadmap. All are draft; no support versions, approvals, releases, or validated product implementations were created. Existing approved obligations were not changed because the repository contains no approved documents. Formal local approval evidence remains unresolved.

## Unreleased implementation guidance — 2026-10-23

Added Java, Spring, and Angular convention drafts; a short database-owned work candidate; and a worked REST/background validation-job design with OpenAPI, synthetic JSON, SQL sketches, UI/transaction mapping, structural checks, and a pending runtime verification matrix. Runtime versions, application execution, and pattern approval remain unresolved.

## Unreleased technical review bundle — 2026-10-23

Added engineering principles, a logical reference architecture, eight substantive engineering standards, and two candidate patterns. Expanded all five workload profiles with source requirements and verification scenarios. Added a technical reading guide. Recorded local-only drafting and moved inactive GitHub starters under optional hosting material. No normative approval or release was created.

## Unreleased foundation — 2026-10-23

Added draft governance, agent instructions, templates, technology scopes, workload profiles, adoption contracts, catalog generation, and validation. No approved standard or release exists.

Future entries list changed document/requirement IDs, affected profiles, compatibility, migration, and adoption deadlines.
