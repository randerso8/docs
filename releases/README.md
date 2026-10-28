# Release manifests

No approved release exists. The repository remains bootstrap with an empty real reviewer roster.

Use the [local review/release procedure](../governance/local-review-and-release.md). The release helper prepares an unsigned candidate with manifest authors, exact document digests, dependency closure, and change notes under ignored work/. An independent delegated human reviews its canonical digest excluding approval and completes an actual attestation.

Finalization checks the prospective repository, local delegation/evidence, lifecycle/review dates, closure, and independent release authority before creating a new manifests/VERSION.json. It refuses overwrite. Run the explicit release gate and the complete checks, compare against the committed review baseline, and have the delegated human commit and tag the exact snapshot. The helper never commits/tags/publishes. Review records do not authenticate people; the team verifies identities and authorized local custody.

A local immutable tag and full commit can be consumed through an absolute file:/// repository URI without hosting. Verify the manifest and its document digests from that commit. Keep private backups; local JSON and Git history can be replaced by someone controlling the entire repository, which this unsigned workflow cannot prevent.
