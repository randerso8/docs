---
{
  "id": "GOV-008",
  "title": "Hosting and automation",
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
  "updated": "2026-10-23",
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
    "GOV-002",
    "GOV-003",
    "GOV-004"
  ],
  "requirements": [],
  "requires": [],
  "supersedes": []
}
---

# Hosting and automation

> Draft for Software Engineering team review. This document is not an approved standard.

## Current mode: local documentation

The user selected local-only work in the existing repository. Drafting, review feedback, indexing, and validation run locally. A hosting account, remote repository, and CI service are not prerequisites. Git history, if used, remains local unless the user later authorizes a remote.

The root .github/ starter directory has been moved to tooling/optional-hosting/github/.github/. Its files are inactive. The [optional hosting guide](../tooling/optional-hosting/github/README.md) explains what they contain. No remote, hosted workflow, upload, or scheduled AI task was activated.

## Local working process

1. Start with the technical reading guide and identify the owning requirement source.
2. Draft architecture, standards, and patterns with explicit assumptions, source references, and evidence expectations.
3. Capture Software Engineering feedback locally and revise the draft. Keep formal status as draft/in-review until actual approval evidence exists.
4. Regenerate the catalog, run validation and validator tests, and inspect the changed requirement IDs.

The [local review/release procedure](local-review-and-release.md) now supports local content-addressed attestations, candidate preparation, and release validation. repository.json selects local review, but remains bootstrap with empty delegated roles. Human identity/delegation, actual review, authorized storage/backups, and the decision to activate remain outside automated checks. Do not fabricate a reviewer, approval statement, URL, or storage/hosting claim.

## Optional future hosting

If hosting is later selected, verify private access, real reviewer delegation, independent review, stale-approval handling, direct-push restrictions, immutable tags, and administrative bypass. Equivalent controls can be implemented on different hosts. Local configuration flags alone do not prove those controls exist. The optional GitHub assets are one future adapter.

## Automation boundary

Catalog generation, metadata/reference checks, evidence structure, expiry detection, and draft impact reports can run locally. Software Engineering owns actual architecture decisions, risk acceptance, exceptions, and approval. A validation pass does not approve content.

A future maintenance prompt can instruct an agent to read AGENTS.md, run checks, prepare minimal draft amendments with source evidence and consumer impact, preserve approved decisions, and notify only on meaningful change or needed team action. A schedule and permissions are separate setup choices; none was created here.
