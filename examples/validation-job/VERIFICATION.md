# Validation-job verification matrix

> All application runtime scenarios below are pending. This is a plan, not a test result or compliance record.

The [worked guide](../../architecture/reference-architectures/validation-job-example.md) owns the reference narrative. Store eventual pilot-specific results, source/artifact versions, sanitized evidence, limitations, and reviewer identity in the pilot application's documentation.

| Scenario | Action | Required observation | Source requirement |
| --- | --- | --- | --- |
| V01 — New intent | Submit authorized valid input | One committed job; 202/PENDING; no claim of completed execution | REL-WORK-006 |
| V02 — Same-key replay | Repeat the same normalized input/key, including concurrent requests | One job; authorized current representation; no second effect | REL-WORK-003 |
| V03 — Key conflict | Same scoped key with different dataset input | Safe 409; original job unchanged | INT-CONTRACT-001 |
| V04 — Resource scope | Query another actor/tenant's UUID | No resource disclosure or unscoped fallback | IAM-CORE-002 |
| V05 — Token validation | Wrong issuer/audience/type, tampered/expired token | Rejected through the actual Spring security chain; 401 includes an applicable WWW-Authenticate challenge | IAM-CORE-003 |
| V06 — Lost submit response | Commit then disconnect before client receives response | Client keeps unknown state and retries the same intent safely | ANG-APP-002 |
| V07 — Competing workers | Session A locks one PENDING job; session B attempts claim | B skips that row; no duplicate committed result | REL-WORK-004 |
| V08 — Pre-commit death | Kill/roll back worker after result write, before commit | No terminal/result change persists; row remains eligible | DATA-STORE-003 |
| V09 — Post-commit death | Commit worker then terminate it before a local acknowledgment | Terminal result persists and is not reprocessed | REL-WORK-003 |
| V10 — Domain result | Process the three synthetic flags | SUCCEEDED with total 3 / invalid 1; invalid data is not confused with execution failure | INT-CONTRACT-004 |
| V11 — Unexpected/poison work | Inject permanent failure and exhaust transient budget | Rollback, bounded attempts, polling stops, accountable intervention | REL-WORK-002 |
| V12 — Operator race | Authorized failure handler races a worker | Guarded state transition; terminal result not overwritten; audit exists only for actual change | OBS-OPER-005 |
| V13 — Test transaction | Commit submission then process/read through another connection | Real boundary works; an automatically rolled-back test does not conceal it | SPRING-APP-007 |
| V14 — Stale UI and teardown | Change resource or navigate during polling | Owned polling stops; obsolete result cannot replace current selection | ANG-APP-004 |
| V15 — Untrusted poll target | Response suggests another origin | Credentials are not sent; recovery stays inside trusted API policy | ANG-APP-006 |
| V16 — Malformed binding | Extra, wrong-type, invalid-size request/response fields and malformed jobId paths | Explicit contract handling and safe errors | SPRING-APP-004 |
| V17 — Permission/input sealing | Runtime tries to mutate sealed input or perform admin action | Role controls enforce declared limits | SEC-BASE-006 |
| V18 — Accessible status | Keyboard/screen-reader walkthrough of pending, success, failure | Meaningful controls, focus, and status feedback | ANG-APP-005 |

## Evidence status

Repository metadata/link validation, catalog generation, and the artifact structural check can run locally. They do not satisfy the runtime observations above. Full OpenAPI validation, PostgreSQL execution, framework compilation, security integration, resource limits, and concurrency/crash behavior remain unverified.

## Promotion boundary

Before approval, select toolchain/product versions and a real isolated pilot environment. Execute the scenarios with actual framework boundaries and PostgreSQL, record the results and failures, and resolve them. Keep credentials, personal data, and raw sensitive diagnostics out of the evidence.
