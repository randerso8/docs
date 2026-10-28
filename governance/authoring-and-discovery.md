---
{
  "id": "GOV-007",
  "title": "Authoring and discovery",
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
    "GOV-002"
  ],
  "requirements": [
    "GOV-DOC-001",
    "GOV-DOC-002"
  ],
  "requires": [],
  "supersedes": []
}
---

# Authoring and discovery

> Draft for Software Engineering team review. This document is not an approved standard.

## Contract

Use the metadata schema and templates. Document IDs survive moves. Integer revisions track document changes; semantic release versions track approved collections. Dates are ISO calendar dates. Record verified minimal work identifiers for contributors and real delegated human reviewers; keep supporting identity proof outside the repository. The initial author marker records AI-assisted provenance.

### GOV-DOC-001 — Metadata

Every governed document MUST have schema-valid front matter. required_approvals identifies engineering and any security role. requirements lists locally owned IDs; requires lists external requirement IDs; depends_on lists source dependencies. supersedes identifies predecessors and requires reciprocal superseded_by on each predecessor. Empty central applicability arrays mean all values in that dimension. Use technology-support-decision for support parameter ADRs; use architecture-decision for ordinary ADRs. Support parameter records own no normative requirement IDs and declare the support framework dependencies. The [adoption source](application-adoption.md) defines how application selections differ from central applicability.

### GOV-DOC-002 — Discovery

The catalog MUST be generated from source metadata and digests. Never edit it manually. Discovery filters by release membership, lifecycle, applicability, and dependency closure. A filename or matching title is insufficient authority.

## Readability

Use one H1, clear headings, relative local links, fenced examples, final newlines, and no trailing whitespace. Owned requirements need headings containing their IDs. Update links when moving content. External links are reviewed manually and never fetched during validation.

## Dependency meaning and navigation

Use depends_on only for sources needed to interpret or satisfy the document, including owners of requires IDs. These are approval and release prerequisites. A related-reading link, discovery table, scope landing page, or progress report does not make every linked draft a prerequisite. Keep navigation links in the body. Indexes can be reviewed without promoting every linked implementation pattern; a substantive pattern still declares all actual source requirements.

Review discovery on contrasting application selections before broad adoption: frontend/BFF/API, a standalone processor, scheduled/restartable batch, and integration/message consumption. Check relevance, source conditions, support parameters, and missing released dependencies; a cycle-free graph does not establish task usability. The [reading guide](../START-HERE.md) supplies task routes and navigation vocabulary without making all linked sources prerequisites of this authoring document.

## Bounded task retrieval

Whole-application adoption establishes the baseline. For a bounded task within that application, identify the affected components, behavior, contracts, state, trust, and recovery; locate the corresponding requirement owners and follow their dependencies. Expand the set when the change affects neighboring consumers or responsibilities. This narrows what needs active review for the task without removing unrelated baseline obligations or claiming whole-application compliance.

Check a reading route by asking an unfamiliar reader to identify source IDs, constraints, conditional exclusions, decisions needed, and evidence to update for a concrete task. A route succeeds when it retrieves the relevant sources and exposes missing decisions; reading every document or producing a long citation list is not itself evidence of understanding. Keep reports explicit about what was inspected, changed, verified, and left unresolved.
