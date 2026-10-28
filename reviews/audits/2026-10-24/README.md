# Documentation self-audit — 2026-10-24

Internal. Performed by the drafting AI at the user's request before human review. This is a self-audit, not independent architectural approval, certification, or proof of application behavior.

## Outcome

Reviewed all 49 governed source documents and all 125 proposed requirements in 15 bounded tasks, plus repository instructions, templates, schemas, review/release/validation tooling, tests, inactive hosting assets, and the worked API/SQL source pack. Corrected 13 findings, including two high-impact review-control gaps. Stable document/requirement IDs and ownership were preserved. All governed sources remain draft. 21 governed drafts changed; other sources were reviewed without a rewriting quota.

The core architecture still separates business rules/adapters, durable acceptance/completion, transaction/external-effect boundaries, server authorization, and workload recovery. No new product, version, topology, browser-session model, broker, or Valkey use was selected.

## Bounded tasks and source coverage

| Task | Scope | Governed sources | Result |
| --- | --- | --- | --- |
| T01 | Inventory and all root entry points | Operational files / integrated checks | Complete |
| T02 | Authority, lifecycle, handling, metadata | [GOV-001](../../../governance/authority-and-ownership.md), [GOV-002](../../../governance/document-lifecycle.md), [GOV-003](../../../governance/information-handling.md), [GOV-007](../../../governance/authoring-and-discovery.md) | Complete |
| T03 | Releases, exceptions, adoption, local workflow | [GOV-004](../../../governance/standards-versioning.md), [GOV-005](../../../governance/exceptions.md), [GOV-006](../../../governance/application-adoption.md), [GOV-008](../../../governance/hosting-and-automation.md), [GOV-011](../../../governance/local-review-and-release.md) | Complete |
| T04 | Roadmap/support/discovery | [GOV-009](../../../governance/implementation-roadmap.md), [GOV-010](../../../governance/technology-support.md), [GUIDE-001](../../../technologies/README.md), [GUIDE-002](../../../technologies/support-status.md) | Complete |
| T05 | Architecture/principles/reference view | [ARC-001](../../../architecture/README.md), [ARC-002](../../../architecture/principles/engineering-principles.md), [ARC-003](../../../architecture/reference-architectures/application-and-workloads.md) | Complete |
| T06 | Security/identity/contracts | [STD-002](../../../standards/security/application-security.md), [STD-003](../../../standards/identity-and-access/identity-and-authorization.md), [STD-005](../../../standards/api-and-integration/contracts-and-compatibility.md) | Complete |
| T07 | Persistence/reliability/delivery | [STD-004](../../../standards/data/persistence-and-migrations.md), [STD-006](../../../standards/reliability/execution-and-recovery.md), [STD-009](../../../standards/delivery/build-and-change-control.md) | Complete |
| T08 | Standards discovery/observability/verification | [STD-001](../../../standards/README.md), [STD-007](../../../standards/observability/operational-signals.md), [STD-008](../../../standards/testing/verification-evidence.md) | Complete |
| T09 | Java/Spring/Angular | [TECH-001](../../../technologies/java/README.md), [TECH-002](../../../technologies/spring/README.md), [TECH-003](../../../technologies/angular/README.md), [TECH-008](../../../technologies/java/engineering-conventions.md), [TECH-009](../../../technologies/spring/application-conventions.md), [TECH-010](../../../technologies/angular/application-conventions.md) | Complete |
| T10 | PostgreSQL/Keycloak | [TECH-004](../../../technologies/postgresql/README.md), [TECH-006](../../../technologies/keycloak/README.md), [TECH-012](../../../technologies/postgresql/application-conventions.md), [TECH-013](../../../technologies/keycloak/application-conventions.md) | Complete |
| T11 | Python/Valkey | [TECH-005](../../../technologies/python/README.md), [TECH-007](../../../technologies/valkey/README.md), [TECH-011](../../../technologies/python/engineering-conventions.md), [TECH-014](../../../technologies/valkey/application-conventions.md) | Complete |
| T12 | Five workload profiles | [WRK-001](../../../workload-profiles/rest-api.md), [WRK-002](../../../workload-profiles/soap-service.md), [WRK-003](../../../workload-profiles/scheduler.md), [WRK-004](../../../workload-profiles/batch-processor.md), [WRK-005](../../../workload-profiles/message-consumer.md) | Complete |
| T13 | Patterns/worked reference/SQL/OpenAPI/verification | [PAT-001](../../../patterns/README.md), [PAT-002](../../../patterns/integration/durable-work-receipts.md), [PAT-003](../../../patterns/application/rest-request-pipeline.md), [PAT-004](../../../patterns/operations/short-database-work-queue.md), [ARC-004](../../../architecture/reference-architectures/validation-job-example.md) | Complete |
| T14 | Schemas, tooling, tests, templates, inactive hosting | Operational files / integrated checks | Complete |
| T15 | Integrated checks, coverage and closure report | Operational files / integrated checks | Complete |

The standards index was included in T08 as the final domain cross-check. Each task assessed necessity, clarity, conditional scope, evidence, ownership, conflicts, and unsupported claims. [coverage.json](coverage.json) records every governed source assignment and the discovery exercises. Task completion means the stated audit scope was performed; pending application/runtime decisions remain below.

## Findings and corrections

| ID | Impact | Finding | Resolution |
| --- | --- | --- | --- |
| A01 | Medium | Navigation was treated as mandatory release dependency closure | Fixed: Removed reading-only dependencies from discovery indexes, roadmap, and technology landing pages; retained actual source prerequisites. |
| A02 | Medium | Applicability seeding and conditional non-applicability were ambiguous | Fixed: Specified canonical selectors, both-dimension matching, requirements-bearing seeds, optional pattern/guide handling, and reviewed source-based non-applicability. Exercised two different selections. |
| A03 | Medium | Deprecated guidance had inconsistent new-adoption treatment | Fixed: Aligned ownership, release, adoption, and agent instructions: existing use only; new adoption rejects deprecated closure. |
| A04 | Medium | Prohibited personal information conflicted with accountable review identities | Fixed: Allowed minimal verified work identifiers while excluding identity proof/personnel/contact/customer material. Clarified local access/backup controls. |
| A05 | High | Candidate preparation/application omitted metadata and revision safeguards | Fixed: Validate source metadata before writing a package and reject revision decreases at application. Two reproduced regressions. |
| A06 | High | Required review roles could be weakened and critical controls depended on paths | Fixed: Preserve required roles within a request; protect lifecycle/release/security control IDs after moves; require previous role authority for reviewed policy changes. Three regression cases. |
| A07 | Medium | Current reviewer changes could invalidate immutable retired history | Fixed: Keep structural historical evidence checks; use pinned historical authority. New retirement still requires current delegated approval against a baseline. Compare both review and last-release snapshots. Two regressions. |
| A08 | Medium | Nested work directories could hide governed documents from scanning | Fixed: Limit scratch exclusions to repository-root work/outputs; scan nested governed folders. Reproduced regression. |
| A09 | Low | The approved-release pointer accepted arbitrary strings | Fixed: Constrain pointer to a numeric version tag or null. Shape regression; actual Git tag/snapshot verification remains a separate step. |
| A10 | Medium | Bearer API 401 responses omitted the required challenge | Fixed: Add WWW-Authenticate to both 401 responses and enforce it in the fixture checker. Also specify malformed-path and unexpected GET errors. Reproduced negative test. |
| A11 | Medium | Request-level CSRF behavior was underspecified for automatic credentials | Fixed: Clarify the identity requirement and Spring evidence for cookie/browser-automatic credentials; no browser-session architecture selected. |
| A12 | Low | An example environment observation sounded permanently current | Fixed: Date the initial toolchain/container observation and retain pending runtime status. |
| A13 | Low | Inactive hosted checks omitted the newer example consistency check | Fixed: Align optional workflow/review template with required local checks; keep hosting inactive. |

Eight counterexample tests failed before their fixes; those tests now pass. Two further history/authority preservation regressions were added. No finding was closed solely because the original generic validation passed.

## Verification

| Check | Result |
| --- | --- |
| Generated catalog | 49 governed drafts; 125 proposed requirements |
| Repository validation | Passed; zero warnings |
| Test suite | 56 passed; zero failed/skipped; ten audit regressions added |
| Existing example | Passed structure for two operations and 25 local JSON references, challenge declarations, sample alignment, and canonical fingerprint |
| Identity/requirement preservation | Same 49 document IDs and all 125 requirement IDs remain with their original source owners |
| Focused discovery exercise | Python/batch excludes Java/Spring/Angular/Keycloak/Valkey conventions; Java/Spring/Angular/PostgreSQL REST excludes Python/Valkey conventions |
| Release prerequisites | Roadmap closure reduced to GOV-009/GOV-001/GOV-002; technology discovery index closure to GUIDE-001/GOV-007/GOV-001/GOV-002 |

Discovery exercises evaluate the documented algorithm against draft metadata in an assumed selected set. They are not an approved adoption or a completed application-side enforcement adapter. Root scratch and temporary test fixtures remain excluded; nested governed work/outputs folders remain checked. The tests create/remove synthetic fixtures and did not add real approvals to the repository.

## Official-source checks

Critical technical assertions were spot-checked on 2026-10-24 against primary sources. These checks are not an exhaustive audit of every external URL, every product release, or every claim in the upstream manuals. Existing reference editions do not become supported-version selections.

| Area | Assertion confirmed | Official source |
| --- | --- | --- |
| Java | Records are shallowly immutable carriers | [Java Record API](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/lang/Record.html) |
| Spring | Proxy-mode self-invocation does not establish the annotated transaction | [Transactional interception](https://docs.spring.io/spring-framework/reference/data-access/transaction/declarative/annotations.html) |
| Angular | HttpClient generic types do not validate response data at runtime | [HTTP request typing](https://angular.dev/guide/http/making-requests) |
| Python | Structured concurrency relies on cancellation and cleanup/propagation behavior | [asyncio tasks](https://docs.python.org/3/library/asyncio-task.html) |
| PostgreSQL | Superuser/BYPASSRLS and usual owner behavior differ from ordinary RLS enforcement | [Row security](https://www.postgresql.org/docs/18/ddl-rowsecurity.html) |
| Keycloak | Database migration recovery can require restoring compatible installation/database state | [Upgrade preparation](https://www.keycloak.org/docs/latest/upgrading/index.html) |
| Valkey | Replication acknowledgment does not establish strongly consistent failover; Pub/Sub is at-most-once | [Replication](https://valkey.io/topics/replication/), [Pub/Sub](https://valkey.io/topics/pubsub/) |
| HTTP | A 401 response requires an applicable WWW-Authenticate challenge | [RFC 9110, section 11.6.1](https://www.rfc-editor.org/rfc/rfc9110.html#name-www-authenticate) |
| Browser request security | CSRF integration depends on credentials automatically attached by the browser | [Spring CSRF](https://docs.spring.io/spring-security/reference/servlet/exploits/csrf.html) |

## Changes and compatibility

- [ARC-001](../../../architecture/README.md): draft revision 4, updated 2026-10-24.
- [GOV-006](../../../governance/application-adoption.md): draft revision 3, updated 2026-10-24.
- [GOV-007](../../../governance/authoring-and-discovery.md): draft revision 2, updated 2026-10-24.
- [GOV-001](../../../governance/authority-and-ownership.md): draft revision 2, updated 2026-10-24.
- [GOV-002](../../../governance/document-lifecycle.md): draft revision 3, updated 2026-10-24.
- [GOV-009](../../../governance/implementation-roadmap.md): draft revision 6, updated 2026-10-24.
- [GOV-003](../../../governance/information-handling.md): draft revision 2, updated 2026-10-24.
- [GOV-011](../../../governance/local-review-and-release.md): draft revision 2, updated 2026-10-24.
- [GOV-004](../../../governance/standards-versioning.md): draft revision 4, updated 2026-10-24.
- [PAT-001](../../../patterns/README.md): draft revision 4, updated 2026-10-24.
- [STD-003](../../../standards/identity-and-access/identity-and-authorization.md): draft revision 2, updated 2026-10-24.
- [STD-001](../../../standards/README.md): draft revision 3, updated 2026-10-24.
- [TECH-003](../../../technologies/angular/README.md): draft revision 3, updated 2026-10-24.
- [TECH-001](../../../technologies/java/README.md): draft revision 3, updated 2026-10-24.
- [TECH-006](../../../technologies/keycloak/README.md): draft revision 3, updated 2026-10-24.
- [TECH-004](../../../technologies/postgresql/README.md): draft revision 3, updated 2026-10-24.
- [TECH-005](../../../technologies/python/README.md): draft revision 3, updated 2026-10-24.
- [GUIDE-001](../../../technologies/README.md): draft revision 4, updated 2026-10-24.
- [TECH-009](../../../technologies/spring/application-conventions.md): draft revision 2, updated 2026-10-24.
- [TECH-002](../../../technologies/spring/README.md): draft revision 3, updated 2026-10-24.
- [TECH-007](../../../technologies/valkey/README.md): draft revision 3, updated 2026-10-24.

Substantive proposed requirement clarifications affect GOV-AUTH-002, GOV-INFO-001, GOV-REL-002, GOV-APP-001, GOV-APP-002, and IAM-CORE-004. No requirement ID was repurposed or moved. Supporting lifecycle/authoring and Spring evidence text was clarified. Navigation dependency removals deliberately reduce unrelated release prerequisites; actual requirement-owner dependencies remain intact.

These are amendments to an unreleased draft baseline, not silent changes to approved obligations. Future changes to released obligations must follow the versioning/migration policy. Backups of modified existing files are under ignored work/audit-2026-10-24-backup. Earlier unsigned work previews may be stale after this audit; prepare fresh candidates when human review begins rather than applying old requests.

## Remaining boundaries and decisions

- Independent Software Engineering review is still pending. The repository is bootstrap, real role rosters are empty, and no actual approval/delegation/release records were created. This audit does not supply human identity or approval.
- Local attestations are unsigned claims. Their hashes bind content, not a person. Real identity, delegation, private access/backups, and custody require the team process. A repository administrator can rewrite unsigned history.
- Historical transition checks require immutable baselines. Run the review-baseline comparison and the last-release comparison when applicable. A format-valid approved_release value does not by itself verify its real Git tag/commit/snapshot.
- Application-side discovery, pins, compliance mappings, and exception scope/expiry enforcement still require a consuming-application adapter and tests. Central schemas do not constitute that implementation.
- Supported versions/distributions, browser/session architecture, tenant/realm model, deployment objectives, broker selection, and Valkey use cases remain team decisions with pilot evidence.
- Java/Spring/Angular compilation, PostgreSQL SQL/concurrency/crash execution, real Keycloak/Valkey integration, full OpenAPI validation, and all 18 runtime example scenarios remain pending. No service was started and no toolchain installed for this document audit.
- Secret scanning is heuristic and source checks were targeted; neither proves absence of all prohibited content or exhaustive technical correctness.

The audit is complete within this recorded scope. The next stage can use these corrected drafts for independent review; it need not treat the source pack as production-ready or activate any release.
