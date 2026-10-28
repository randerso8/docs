---
{
  "id": "GOV-011",
  "title": "Local review and release procedure",
  "type": "guide",
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
    "GOV-001",
    "GOV-002",
    "GOV-003",
    "GOV-004"
  ],
  "requirements": [],
  "requires": [
    "GOV-LIFE-001",
    "GOV-LIFE-002",
    "GOV-REL-001",
    "GOV-REL-002",
    "GOV-AUTH-002",
    "GOV-INFO-001"
  ],
  "supersedes": []
}
---

# Local review and release procedure

> Draft for Software Engineering team review. The tools are implemented; no reviewer has been delegated and no document or release is approved.

## Purpose and trust boundary

Use local files and local Git history to implement the [lifecycle](document-lifecycle.md) and [standards release policy](standards-versioning.md). GOV-LIFE-001 owns independent approval and GOV-REL-002 owns approved dependency closure. This guide adds operating instructions, not a second set of normative requirements. The Software Engineering team owns all roles.

A local JSON attestation is an auditable human claim. Hashes prove its content/subject binding and detect alteration; they do not authenticate its author. A team owner verifies the real identities and delegation outside the scripts, using the organization's accountable process, then retains that evidence safely. Verify filesystem access, approved AI handling, and private backup/custody of Git history and review records. A person able to rewrite the whole repository and its history can replace unsigned attestations; this workflow does not prevent that. It has no cryptographic signatures or identity provider. Do not describe a validation pass as identity proof.

## 1. Establish actual delegation

The repository currently selects review.mode local, keeps phase bootstrap, and leaves roles empty. A human team owner supplies actual author/reviewer identifiers and engineering/security/release delegation in repository.json. Authors cannot approve their own document or manifest. One independent person may cover engineering and security only when delegated to both. No special separation between team ownership and security ownership is assumed.

After recording the actual roster, run node tooling/review.mjs delegation to print its unsigned attestation form and exact digest. Save that form under ignored work/, then have the accountable team owner complete reviewer, date, decision, and statement only after verifying the roster. Store the completed record with node tooling/review.mjs store work/COMPLETED_DELEGATION.json. Put the returned local:reviews/records/HASH.json reference in review.delegation_evidence. A roster/name/owner change requires fresh evidence; reordering the roster does not.

The root delegation is a human trust decision, not self-authentication by a JSON file. Keep supporting identity proof and restricted personnel records outside this repository; use the minimum verified work identifiers allowed by the information-handling source. Never generate a person's approval statement without their explicit decision. GOV-INFO-001 prohibits secrets and restricted material in all review records too.

## 2. Submit and prepare a document

Read the actual source and its dependencies. Start with authority/ownership, then lifecycle and information handling, then releases and the other governance sources. Use the catalog dependency graph rather than approving the discovery index first. Draft technical guidance can stay draft while a smaller governance baseline matures.

Set a review-ready live source to in-review, increment a previously reviewed revision as required by GOV-LIFE-002, and record real authors. Commit that review baseline locally and retain its full commit. No tool does this automatically.

Run node tooling/review.mjs prepare governance/authority-and-ownership.md (or the actual target). It creates an ignored work/review-requests/ package containing request.json, candidate.md, a blank review-form.json, and instructions. The candidate proposes final approved status and removes the draft banner; its exact digest is what humans review. Live status and approvals stay unchanged.

Preparation can preview a draft too, but applying it requires an unchanged in-review source. After submitting a draft, prepare a fresh request. Work packages are not cataloged authority. Edit the live source and prepare again if the proposed content needs changes; do not patch an already-reviewed candidate.

## 3. Record and apply human review

A delegated independent reviewer reads the complete candidate, applicable source requirements, rationale, and evidence. The reviewer completes a separate copy of the form for each required role, with their identifier, actual date, approved/rejected decision, and statement describing what they reviewed. A rejection is retained as evidence but cannot authorize promotion.

Store each completed form with node tooling/review.mjs store work/COMPLETED_REVIEW.json. The command validates shape, safe content, and role/subject consistency, then creates an immutable-by-name record under reviews/records/. It does not authenticate the human or approve the source. Repeat with the same exact record returns its existing reference.

Apply complete real approval evidence using node tooling/review.mjs apply work/review-requests/PACKAGE/request.json local:reviews/records/HASH.json followed by any other required record references. The helper checks unchanged source bytes, valid metadata, candidate identity/digest, nondecreasing revisions, retained required review roles, reviewer delegation, independent review, role coverage, decision/date/subject bindings, and dependency state in an isolated preview before editing the live document. Invalid evidence leaves the live source unchanged. No reviews are generated by apply.

Regenerate the catalog, run all checks, inspect the change, and compare with the committed review baseline. Commit the approved document and its records locally only after reconciliation. Repeat in dependency order. Changing the candidate after approval requires fresh review.

## 4. Prepare and finalize a release

After the real delegation, storage/custody, and governance review are accepted, an accountable human decides when to set phase active. Keeping bootstrap blocks releases even with valid document review. Neither preparation nor validation flips that switch.

Run node tooling/release.mjs prepare 1.0.0 --author REAL_MANIFEST_AUTHOR --change "Actual reviewed change summary" GOV-001 with the actual selected IDs. The version and ID are illustrative, not a release selection. The helper requires approved/deprecated selected documents and adds their dependency/requirement-owner closure automatically. It writes an unsigned manifest and blank release review form under work/release-candidates/. It refuses an existing version/candidate rather than overwriting it.

The independent delegated release reviewer checks selected authority, compatibility/migration, document approvals, review dates, and the exact manifest digest excluding approval. Store their completed release form using the same record command. Run node tooling/release.mjs finalize work/release-candidates/VERSION/manifest.json local:reviews/records/HASH.json. It validates the full prospective repository and explicit release gate before creating a new releases/manifests/VERSION.json. It refuses existing manifest files and never commits, tags, uploads, or publishes.

Run catalog generation, repository validation, the test suite, and example checks, then validate the manifest explicitly with --release and compare with the immutable review baseline using --base, then repeat against the last released commit if one exists. The second comparison protects older approved history even when the review baseline contains an in-review revision. Commit the exact checked files, records, configuration, and catalog; create the immutable vVERSION tag on that commit as the human release action. Verify the tag's resolved full commit and the manifest/document digests from that commit, not from a later working tree. Record the accepted tag in approved_release without moving it; that pointer update belongs in a subsequent operational commit to avoid a circular self-reference.

GOV-REL-001 owns exact consumption. Back up the local repository/history and records privately. Any future distribution/hosting remains a separate user decision.

## 5. Application consumption and history

An application can use an absolute file:///C:/... repository URI in its lock while local. Resolve and compare the exact release tag and full commit, read the manifest/catalog/docs from that snapshot, and verify selected authority under GOV-AUTH-002. The location is machine-specific; moving it requires an explicit location update without silently changing the pin. This central workflow does not implement application-side compliance checks.

Baseline checks reject rewriting/deleting committed review records or release manifests. Keep superseded/rejected attestations; current document approvals reference only the applicable record. An emergency credential/content exposure still follows the controlled information-handling process rather than routine history rewrites.

Local exception evidence uses the same record shape with subject kind exception and the canonical exception digest excluding approvals, stored with the owning application. Application-side validation must verify it against the locked central delegation, scope, expiry, authors, and baseline. The central validator does not claim to implement that application adapter.

## Current readiness

Only implementation and isolated synthetic tests are complete. The real repository remains bootstrap, all governed documents remain draft, actual roles are empty, no attestation records are populated, and there is no approved release or tag. The [tooling guide](../tooling/README.md) explains checks and limitations.

## Later lifecycle transitions

The current prepare/apply helper handles approval of an in-review source. Deprecation and retirement are reviewed manual transitions under the lifecycle; do not use the helper to silently re-approve deprecated content. Stage the proposed final state/revision and migration or retirement rationale, calculate its exact digest, obtain real independent evidence, and validate against the appropriate prior snapshot. The role coverage needed for a previously reviewed policy change cannot be discarded merely by editing required_approvals.

A new retirement is checked against current delegation in a baseline comparison. After retirement is recorded, a former reviewer's departure does not invalidate the unchanged historical record. Current authority for active guidance remains subject to current delegation. Never infer either result without the relevant immutable snapshot.
