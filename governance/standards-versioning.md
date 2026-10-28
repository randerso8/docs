---
{
  "id": "GOV-004",
  "title": "Versioned standards and releases",
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
    "GOV-001",
    "GOV-002",
    "GOV-003"
  ],
  "requirements": [
    "GOV-REL-001",
    "GOV-REL-002",
    "GOV-REL-003"
  ],
  "requires": [],
  "supersedes": []
}
---

# Versioned standards and releases

> Draft for Software Engineering team review. This document is not an approved standard.

## Release unit

A standards release is an immutable Git tag vMAJOR.MINOR.PATCH and a manifest under releases/manifests/. The manifest identifies included document IDs and digests. Git captures the full snapshot; the manifest defines its approved authority set. Draft files in the same snapshot remain non-authoritative.

### GOV-REL-001 — Immutable consumption

Applications MUST pin an exact tag and full commit hash. Verify that the tag resolves to that commit and read the manifest from that commit. Do not use main, latest, or a floating range as authority. Published tags cannot be moved or reused.

### GOV-REL-002 — Approved dependency closure

A release MUST select only approved or explicitly deprecated documents, include all dependencies and referenced requirement owners, and have current review evidence and dates. Retired content stays historical. New adoptions MUST NOT select deprecated guidance, including dependencies; deprecated content is retained only for existing use. Record release-role review evidence and validate the manifest before publication.

### GOV-REL-003 — Compatibility

Changed obligations MUST list affected IDs, profiles, migration, and deadlines where needed. Major versions change existing obligations incompatibly or remove approved approaches. Minor versions add opt-in backward-compatible guidance. Patches correct wording without changing obligations. Adding a mandatory requirement to an existing profile is a major change.

## Local release support

The user selected local-only work. The [local review/release procedure](local-review-and-release.md) and offline helpers now support digest-bound human attestations and release candidates. The repository remains in bootstrap with no delegated reviewers, approvals, or approved release. The implemented path does not imply the team has accepted a baseline.

## Release procedure

1. Choose local or hosted review explicitly in repository.json. In local mode, establish the real delegated roster and its exact digest-bound team-owner attestation, verify authorized local access/backup, and obtain the human decision to exit bootstrap. In hosted mode, verify private hosting, delegation, and protected review.
2. Select reviewed documents and their dependency/requirement-owner closure. Record manifest authors, exact document digests, compatibility, migration, and change notes. The proposed first approved baseline is 1.0.0; none exists yet. The local helper prepares an unsigned candidate under ignored work/.
3. Obtain independent release-role review of the canonical manifest digest excluding approval. A manifest author cannot approve it. Keep local attestation records under reviews/records/; a hosted release uses protected HTTPS evidence.
4. Finalize a new manifest under releases/manifests/VERSION.json, run the complete checks and the explicit release gate, and compare with the committed review baseline and, when present, the last released snapshot. The helper refuses overwrite and does not commit or tag.
5. A delegated human maintainer commits the exact validated manifest, documents, records, catalog, and configuration, then creates the immutable local vMAJOR.MINOR.PATCH tag on that commit. Verify its full resolved commit and the manifest at that commit before handing it to a consumer. Keep private backups of local Git history and records. Hosting/publishing requires separate user authorization.

The manifest does not embed its own containing commit, avoiding a circular self-reference. The tag and application lock identify that commit. Existing manifests and committed review records cannot be rewritten or deleted in a baseline comparison. Configuration and attestations are claims: a human verifies the identities, authorized storage, and custody that make them trustworthy.

Urgent security changes use an explicit risk decision and rollout deadline, never a silent mutation of an older pin.
