# Application documentation

Copy this directory into an application's docs/. Replace unset fields. Keep decisions/, runbooks/, compliance/, and exceptions/ locally. Schema validation intentionally rejects null pins until a real release is selected.

Use [the requirement assessment template](compliance/requirements.md) to record component/actor scope, evidence, conditional non-applicability, justified SHOULD deviations, approved exceptions, and unresolved gaps. Application CI validates the pin, release/profile closure, evidence, and exception scope. Keep evidence internal and omit prohibited content.

For local-only consumption, use an absolute file:/// repository URI in the lock, while retaining the exact release tag/full commit/manifest. Read the pinned Git snapshot, verify its digests, and keep evidence tied to that snapshot rather than a changing source working tree. Local exception attestations stay with the application; application-side enforcement is not supplied by this central template.

Document conditional non-applicability with a reviewed source-based rationale; do not create an exception just because the source trigger is absent. Record actual technologies, workload_description, and profile_selection_rationale. The workloads array selects all specialized profiles matching actual behavior; it may be empty only with a reviewed no-match rationale. Empty application selection does not mean universal scope or waive shared requirements. Include applicable technology-support-decision records, including restrictions and prohibitions. Exclude navigation-only pages from implementation seeds and verify the dependency closure is present in the pinned release. New adoption cannot select deprecated guidance. See the central adoption source for the complete algorithm.

Point the application repository's primary agent instructions to this documentation entry point and its local AGENTS.md. Record which component owns each technology, execution responsibility, state boundary, and evidence item in architecture.md and the assessment table.
