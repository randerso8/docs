# Templates

Copy the appropriate template into a governed directory. Replace every placeholder, allocate a real unused ID, update dates/applicability, and leave approvals empty until actual review. Templates are excluded from the catalog.

Use standard.md, architecture-decision.md, implementation-pattern.md, and workload-profile.md for central content. Use [technology-support-decision.md](technology-support-decision.md) for central product/distribution support choices and compatible version policy; it is a specialized ADR with metadata type technology-support-decision, supplying parameters under the support framework rather than owning new requirement IDs. Application templates and scoped exceptions belong to consuming repositories. JSON templates contain null values deliberately; they do not validate as completed adoption, release, or exception records.

Schemas describe completed records. Central validation checks central content and release manifests. Application CI must additionally validate local records, pinned release membership, scope, evidence, and reviewer authority.

Use [local-review-record.json](local-review-record.json) for a completed human attestation after real review. Its null placeholders intentionally fail the completed record schema. Subject kinds are document, release, delegation, and application-owned exception; the local procedure explains the exact digest and authority boundary.
