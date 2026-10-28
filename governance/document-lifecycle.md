---
{
  "id": "GOV-002",
  "title": "Document lifecycle and approvals",
  "type": "governance",
  "status": "draft",
  "revision": 3,
  "owner": "Software Engineering team",
  "classification": "internal",
  "authors": [
    "ai-assisted-bootstrap",
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
    "GOV-001"
  ],
  "requirements": [
    "GOV-LIFE-001",
    "GOV-LIFE-002",
    "GOV-LIFE-003"
  ],
  "requires": [],
  "supersedes": []
}
---

# Document lifecycle and approvals

> Draft for Software Engineering team review. This document is not an approved standard.

## States

| State | Meaning | Consumer treatment |
| --- | --- | --- |
| draft | Proposed content or revision | Informational only |
| in-review | Submitted for review | Informational only |
| approved | Review complete for recorded digest | Eligible for release |
| deprecated | Existing use has a migration path | Existing pins only |
| retired | Historical record | Historical interpretation only |

Normal flow is draft to in-review to approved to deprecated to retired. In-review may return to draft. Approved or deprecated content may enter in-review for a new revision while the last release remains authoritative. Retired content stays retired; create a successor.

### GOV-LIFE-001 — Independent approval

Approval MUST identify an authorized human reviewer, delegated role, date, verifiable review evidence reference, and content digest. In local mode, the reference identifies a content-addressed review record; in hosted mode, it identifies protected review through HTTPS. Authors cannot approve their own document. Security-sensitive documents require engineering and security role coverage. One independent person can cover both only if delegated for both. Agents prepare and check content but cannot grant approval.

### GOV-LIFE-002 — Revision and preservation

Changes to approved content MUST increment revision, explain impact and migration, and receive fresh approval. Preserve approved ADR history using explicit supersession. Do not delete previously approved records; retire them with a successor or documented reason.

### GOV-LIFE-003 — Periodic review

Approved and deprecated documents MUST have an unexpired review_due date. Proposed cadence is six months, shorter for security-sensitive topics. A deadline triggers review, never automatic approval. Overdue guidance blocks new releases; application teams assess existing pins explicitly.

## Digest and evidence

The digest covers recursively sorted metadata except approvals and the normalized Markdown body. Status, dates, authors, ownership, and revision are included. Set the proposed final state before hashing. Adding the real approval record leaves that digest unchanged; any content change needs fresh review. A human maintainer verifies reviewer identity and delegation against the accountable team before accepting local attestations, or a trusted provider adapter verifies protected hosted review. Local records bind the subject kind/ID/digest, reviewer, role, date, decision, and statement; their canonical SHA-256 determines the filename. Offline checks verify those claims and bindings, not the identity of the person who typed them. See the [local review and release procedure](local-review-and-release.md).

## Bootstrap

The initial governed documents are drafts. Agreement to create the foundation does not approve every proposed obligation. Record actual delegated identities and their reviewed roster, verify authorized local storage (or hosted protections), and exit bootstrap only through an accountable human decision before the first release. An agent cannot turn an empty roster into an approved one.

## Historical evidence and reviewer changes

Retired content is historical and cannot be selected for a release. Validate its recorded roles, independent authorship, digest, dates, and evidence bindings without requiring former reviewers to remain in the current roster. Establish its original authority from its immutable historical snapshot. This does not retroactively approve an untrusted historical claim. When a baseline comparison detects a new retirement, current delegated approval is still required for that transition.

Approved/deprecated content proposed for a new release still needs current delegated review. A reviewer departure can therefore require fresh approval for active guidance while leaving retired evidence intact. Compare both the committed review baseline and the last released snapshot when one exists, so a temporary in-review revision cannot hide previously approved history.

The initial three-month review_due values are draft follow-up targets. They do not represent approval dates or silently replace the proposed approved-content review cadence.
