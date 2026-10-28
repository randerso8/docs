# Engineering standards and architecture

Internal documentation owned by the Software Engineering team.

This is a new repository. The team has agreed to the foundation and ownership; the substantive documents are drafts awaiting review. No approved standards release exists. Application repositories must not claim compliance with this draft baseline.

## Start here

Read [the technical reading guide](START-HERE.md) for task-specific routes, terminology, architecture responsibilities, engineering requirements, candidate patterns, and workload profiles. The repository is in local drafting mode; writing and validation do not require a Git host.

Read [agent instructions](AGENTS.md), [authority and ownership](governance/authority-and-ownership.md), [document lifecycle](governance/document-lifecycle.md), and [information handling](governance/information-handling.md). Use the generated [catalog](catalog/documents.json) to discover documents by ID, status, technology, workload, or requirement.

## Repository map

| Location | Purpose |
| --- | --- |
| governance/ | Ownership, approvals, handling, releases, exceptions, and adoption |
| architecture/ | Principles, reference architectures, and shared decisions |
| standards/ | Cross-cutting normative requirements, each owned once |
| technologies/ | Java, Spring, Angular, PostgreSQL, Python, Keycloak, and Valkey |
| workload-profiles/ | REST, SOAP, scheduling, batch, and message consumption |
| patterns/ | Reviewed implementation approaches linked to requirements |
| templates/ | Central document and application documentation templates |
| examples/ | Synthetic reference contracts, SQL, samples, and pending verification plans |
| catalog/ | Generated discovery index |
| schemas/ | Metadata and application adoption contracts |
| tooling/ and tests/ | Offline validation and rejection tests |
| releases/ | Changelog and future immutable release manifests |
| reviews/ | Content-addressed local human attestations; initially empty |

## Local checks

Use Node.js 24 or later. There are no package dependencies to install. Run from this directory:

```text
node tooling/catalog.mjs
node tooling/validate.mjs
node --test tests/*.test.mjs
node examples/validation-job/check-artifacts.mjs
```

See [validation details](tooling/README.md) for checks, approval hashing, and limitations. Validation makes no network requests.

## Audit record

The [2026-10-24 self-audit](reviews/audits/2026-10-24/README.md) covers all governed sources, corrections, and verification limits. It is separate from independent approval.

## Adoption and next steps

The [roadmap](governance/implementation-roadmap.md) records confirmed inputs and open decisions. Application repositories keep local architecture, ADRs, runbooks, adoption manifests, locks, exceptions, and evidence. They consume a pinned central release; see [adoption](governance/application-adoption.md).

The user selected local-only work for now. Optional GitHub starter assets are stored under tooling/optional-hosting/github/ and are inactive. No remote or recurring AI task is configured. The [local review/release workflow](governance/local-review-and-release.md) is implemented and tested. Real delegation, human review, authorized local custody, and activation are pending; the current release gate remains closed during bootstrap. See [local work and optional hosting](governance/hosting-and-automation.md).

## Metadata format

Front matter uses JSON syntax, a strict subset of YAML, between YAML delimiters. Keep quoted keys and strings and JSON arrays. This permits offline validation without parser dependencies or YAML extensions. Catalogs and manifests use JSON for the same reason. Stable IDs survive file moves.

Root entry points, templates, tooling instructions, and release notes are operational files. Documents under governance/, architecture/, standards/, technologies/, workload-profiles/, and patterns/ require metadata and appear in the catalog.
