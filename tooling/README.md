# Validation tooling

Use Node.js 24 or later. There are no third-party dependencies or network requests.

## Commands

Run from the repository root:

```text
node tooling/catalog.mjs
node tooling/validate.mjs
node --test tests/*.test.mjs
node tooling/digest.mjs governance/authority-and-ownership.md
node tooling/validate.mjs --base FULL_40_CHARACTER_COMMIT
node tooling/validate.mjs --release releases/manifests/1.0.0.json
```

The release validation command is illustrative: no release manifest exists yet. Catalog generation writes only catalog/documents.json. Validation/digest commands are read-only; tests use isolated temporary fixtures. The local workflow commands below have explicit write scopes.

## Checks

Validation checks metadata against the committed schemas; unique document and requirement IDs; requirement headings and declared references; dependencies and cycles; reciprocal supersession; applicability shape; internal classification and ownership; dates; role delegation; independent approval; content digests; local inline Markdown links and headings; basic Markdown structure; selected secret indicators; and deterministic catalog consistency.

A base comparison checks lifecycle transitions, revision increases for reviewed changes, removal of reviewed records, and retired content preservation. It also prevents modifying or deleting existing release manifests and committed review records, and fully validates newly added manifests. Supply an immutable full commit hash. Without --base, validation cannot establish how content changed over time. A future hosted pull-request workflow can supply its actual base commit; local users can supply any known immutable baseline.

A release gate checks bootstrap/active state, selected local or hosted controls, a selected authority set, approved states, review dates, digest matching, dependency/requirement-owner closure, independent manifest authorship, and release-review evidence. Local mode requires digest-bound delegation and local attestations; hosted mode still requires protected private hosting assertions and HTTPS evidence. Other historical manifests are schema-checked only: their content digests refer to their own immutable snapshots and must not be compared against later working revisions.

## Schema implementation

Schemas use JSON Schema 2020-12 syntax. The small local evaluator supports exactly the keywords used by the committed schemas and rejects unsupported keywords. It is not a general-purpose implementation of every JSON Schema feature. Tests cover valid records, malformed metadata, and rejection conditions. Schema evolution must update the evaluator and its tests together.

## Approval integrity

For Markdown, SHA-256 hashes recursively key-sorted metadata excluding approvals plus the normalized Markdown body, serialized as canonical JSON. CRLF becomes LF; leading body blank lines and trailing body whitespace are normalized. Metadata status and dates are included. Set the final status before requesting approval, calculate the digest, and obtain review of those exact bytes. Populate the actual approval record afterward. Updating content or metadata invalidates existing evidence.

For release JSON, hash canonical JSON excluding approval. For exception JSON, exclude approvals. For local review records, hash the entire canonical JSON with no excluded fields; the digest is the filename under reviews/records/. The record binds subject kind/ID/digest, reviewer/role/date, decision, and statement. Delegation binds repository name/owner/classification and the sorted exact role roster, so roster changes invalidate old delegation evidence. Reviewer identity and real team authorization remain human trust decisions. A maintainer verifies local identities/custody or a trusted provider adapter verifies hosted review. Editing configuration does not prove storage or host controls.

## Limits

Local link checking covers inline Markdown links and heading fragments. Reference-style links, HTML links, external URLs, and diagrams require review. Secret scanning is a high-confidence heuristic; it does not prove the absence of prohibited content. The scanner suppresses possible secret values from diagnostics. Small text files are supported; files over 2 MiB and symbolic links require separate review rather than being silently ingested.

Application adoption, locks, and exception schemas describe completed application records. Application CI must use those schemas and add pin/tag verification, release-profile discovery, requirement evidence, exception expiry/scope, and provider review verification. This central repository cannot assert compliance for applications that have not been integrated.

## Workflow sources

The inactive optional workflow under optional-hosting/github/.github/ pins the official [checkout release commit](https://github.com/actions/checkout/commit/3d3c42e5aac5ba805825da76410c181273ba90b1) and [setup-node release commit](https://github.com/actions/setup-node/commit/949feb2413d6458794dcd2491c4babbbce0c15c1). Review and update these pins through the same change process as validation tooling.

## Local workflow commands

Read the [complete procedure](../governance/local-review-and-release.md) first. These examples use placeholders and create no real approval by themselves.

- node tooling/review.mjs delegation prints an unsigned roster attestation form; it writes nothing.
- node tooling/review.mjs prepare DOCUMENT.md writes an ignored work/review-requests/ candidate, request, and blank form. It leaves the live document unchanged. Draft previews are allowed; apply needs an unchanged in-review source and actual review.
- node tooling/review.mjs store COMPLETED_RECORD.json writes one content-addressed human attestation under reviews/records/. It checks structure and safe content, not identity. Never run it to manufacture a person's decision.
- node tooling/review.mjs apply REQUEST.json LOCAL_REFERENCE... validates a prospective copy before editing that one live source. It requires real complete approval evidence and explicit human authorization. Regenerate the catalog afterward.
- node tooling/release.mjs prepare VERSION --author REAL_ID --change "Actual summary" DOCUMENT_ID... resolves approved dependency closure and writes an unsigned candidate/form under work/release-candidates/.
- node tooling/release.mjs finalize CANDIDATE.json LOCAL_REFERENCE validates the prospective repository and release gate before creating a new immutable-by-policy releases/manifests/VERSION.json. It refuses overwrite and does not commit/tag/publish.

The local-workflow module previews mutations in a bounded temporary copy under ignored work/, verifies the resolved cleanup path, and removes that copy afterward. New work/candidate paths must remain inside the resolved repository. Request/source/candidate hashes and evidence bindings detect stale or altered inputs. Content-addressed records are not digital signatures. No helper authenticates people, controls filesystem access, protects Git from an administrator, creates an application compliance adapter, or activates the repository automatically.

The required repository review.mode is an intentional bootstrap schema change. Release manifests now require authors so release self-approval can be rejected. Approval evidence accepts HTTPS or strict local record references, selected by mode; a local record cannot substitute for hosted proof. Application locks also accept absolute file:/// repository URIs. No released consumers or approved manifests existed before these format changes. Exception schemas accept local references, but application-side scope/expiry/authority checks remain the consuming application's responsibility.

## Audit clarifications — 2026-10-24

Root work/ and outputs/ are excluded as scratch/deliverable directories. A folder named work or outputs nested under a governed source directory remains scanned. Document preparation validates metadata before deriving candidate paths. Review application rejects revision decreases and removed required review roles even when candidate hashes and supplied attestations agree.

Lifecycle/release/information-handling control IDs require security review even after a file move. Retired records retain evidence structure/digest/date/independence checks without requiring former reviewers to remain delegated today; their authority is historical only. A baseline comparison applies current authority checks to a newly retired record. Active approved/deprecated guidance still fails closed when its current required reviewer is no longer delegated.

For a subsequent release, compare against both the committed review baseline and the last released snapshot. Without a baseline, the validator cannot establish historical transitions or distinguish a new retirement from an existing archived one. approved_release is constrained to a version tag; its real tag/commit/snapshot agreement remains a separate operator/application verification step.

## Coherence format changes — 2026-10-28

Completed adoption records require nonblank workload_description and profile_selection_rationale. The workloads array may be empty; application-side review must verify that no matching specialized profile was omitted and shared requirements remain assessed. Schema validation alone cannot establish that the description or rationale is true.

Support ADRs use document type technology-support-decision, declare affected technologies, own no requirement IDs, and reference the five support requirements and their owner. Central validation checks that shape and required review roles. Application-side discovery must assess all applicable released support parameters, including restrictions/prohibitions and overlapping scope; the central validator does not implement consumer compliance or product/version resolution.
