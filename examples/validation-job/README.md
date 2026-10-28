# Synthetic validation-job source pack

> Draft reference artifacts. No deployed application, approved architecture, or successful runtime execution is claimed.

Read the [worked architecture guide](../../architecture/reference-architectures/validation-job-example.md) for context and source requirement IDs. The example validates synthetic dataset flags through REST submission, short database-owned background work, and UI polling. It demonstrates orchestration, not real business data quality logic.

## Files

| Artifact | Purpose |
| --- | --- |
| [OpenAPI contract](openapi.json) | Example API, response states, safe errors, and scoped replay |
| [JSON samples](samples/create-request.json) | Synthetic input and associated response files under samples/ |
| [Schema](sql/01-schema.sql) | Dataset/job/result invariants for an isolated reference database |
| [Synthetic input](sql/02-synthetic-input.sql) | Three immutable example items, one marked invalid |
| [Acceptance](sql/03-acceptance.sql) | Bound insertion and separate conflict lookup statements |
| [Worker](sql/04-worker.sql) | Short same-transaction lock, result, and completion |
| [Status query](sql/05-status-query.sql) | Tenant/actor/job-scoped retrieval |
| [Operator failure](sql/06-operator-failure.sql) | Investigated guarded termination plus audit |
| [Verification matrix](VERIFICATION.md) | Runtime scenarios and explicit pending evidence |

## Local structural check

From the repository root, run:

```text
node examples/validation-job/check-artifacts.mjs
```

This checks local JSON references, unique operation IDs, required path parameters, declared Bearer challenges on 401 responses, example field/state alignment, and the canonical sample fingerprint. It is a narrow artifact consistency check. It is not a full OpenAPI/JSON Schema validator, SQL parser, Java compiler, Angular build, or API/database/security test.

## Candidate database exercise

Use a dedicated empty reference database/schema only. Review the SQL before execution. The schema is not a production migration, and runtime roles, timeouts, pool sizes, input sealing, and request authorization are deliberately not configured by it.

1. Load schema and synthetic input in a disposable test database. The expected aggregate is totalCount 3, invalidCount 1.
2. Load the PREPARE declarations on each session that executes them. Prepared statements are session-local; an application driver needs equivalent bound statements rather than blindly running PREPARE on every call.
3. In a submission transaction, execute accept_validation with a caller-generated UUID, trusted tenant/actor, intent key, dataset ID/version, and the canonical fingerprint. If insertion returns no row, use find_validation_by_intent as a separate statement, compare input, and preserve resource authorization. Commit before reporting acceptance.
4. In a worker transaction, execute claim_validation. If one row is returned, execute complete_validation for that claimed UUID and require exactly one changed row; then commit. If none is returned, commit without work.
5. Query through get_validation_status using the same authorized tenant/actor. Translate SQL fields/timestamps to the contract response; do not expose internal receipt fields.
6. Execute the two-session, crash, conflict, and operator scenarios in VERIFICATION.md. Test runtime permissions and input immutability separately.

At initial drafting on 2026-10-23, PostgreSQL/psql and the Java toolchain were unavailable and Docker was not running. That is a dated environment observation, not a permanent platform constraint. SQL and framework execution remain pending. Do not use another database's successful parse as evidence of PostgreSQL locking or transaction behavior.

## Example-only choices

OpenAPI 3.1.1 is the fixture format, not a claim about the latest format or the organization's standard. The SQL references PostgreSQL behavior but does not adopt a supported database version. The 1,000-item bound and sample polling hint are illustrative. The API assumes a bearer boundary; a production browser/session design still needs review. No Keycloak realm, Valkey use, broker, cancellation endpoint, long-running lease, or general retry service is implied.
