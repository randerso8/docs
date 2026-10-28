# Local review evidence

Store completed human attestations under records/ using node tooling/review.mjs store COMPLETED_RECORD.json. Files are named by SHA-256 of their complete canonical JSON. No completed records exist initially. Templates contain null fields and are intentionally invalid as completed evidence.

See the [local procedure](../governance/local-review-and-release.md). Records bind exact subject/reviewer/role/date/decision claims; they do not authenticate a person. Verify real identity/delegation and authorized local custody outside automated checks. Do not fabricate approvals or include prohibited content. Committed records are retained, including rejections and superseded evidence.
