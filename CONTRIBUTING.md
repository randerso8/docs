# Contributing

Use [templates](templates/README.md), [the lifecycle](governance/document-lifecycle.md), and the [local review/release procedure](governance/local-review-and-release.md). Locate the owning source before changing an obligation.

1. Create a draft with an unused stable ID, applicability, rationale, dependencies, evidence, and accountable owner.
2. Record alternatives, affected consumers, standards compatibility, and migration. Preserve IDs and history; increment previously reviewed revisions.
3. Regenerate the catalog, run validation/tests/example checks, and review prohibited content.
4. Submit review-ready content as in-review and commit the review baseline locally. Prepare an unsigned candidate using the review helper; the candidate's proposed final state is included in its digest.
5. Obtain actual independent delegated human review of that exact candidate. Store completed attestations and apply them only when real approval and explicit authorization exist. Changing content needs fresh evidence. Security-sensitive changes need both delegated roles.
6. Review and finalize a release candidate with approved dependency closure and an independent release reviewer, then have the delegated human maintainer commit/tag the exact validated snapshot. The helpers do not tag, host, or publish.

Local records are auditable claims, not identity proof. The team verifies identities/delegation and authorized local custody. Hosted review remains optional. Bootstrap blocks releases, and empty templates do not establish approval. Start with the governance sources in dependency order.

For later releases, compare the completed change against both the committed review baseline and the last released snapshot. The second comparison protects older approved history that a temporary in-review revision might otherwise hide. A self-audit can improve a draft before review but cannot supply independent approval.
