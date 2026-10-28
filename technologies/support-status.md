---
{
  "id": "GUIDE-002",
  "title": "Technology support intake and decision index",
  "type": "guide",
  "status": "draft",
  "revision": 2,
  "owner": "Software Engineering team",
  "classification": "internal",
  "authors": [
    "ai-assisted-drafting"
  ],
  "created": "2026-10-23",
  "updated": "2026-10-28",
  "review_due": "2027-01-23",
  "applicability": {
    "technologies": [],
    "workloads": []
  },
  "required_approvals": [
    "engineering"
  ],
  "approvals": [],
  "depends_on": [
    "GOV-010"
  ],
  "requirements": [],
  "requires": [],
  "supersedes": []
}
---

# Technology support intake and decision index

> Draft for Software Engineering team review. Proposed guidance; no formal approval, supported product selection, or runtime certification is implied.

## Current status

No runtime/product version has been selected or approved in this repository. All seven technologies below are candidates named by the user, with draft conventions. This is a discovery/intake index. Only an applicable approved, released support decision created under [GOV-010](../governance/technology-support.md) can authorize a version choice. No approved support decision exists yet.

## Evidence to collect

Official links checked on 2026-10-23. Moving source pages may change; recheck the exact release pair before a decision. The reference editions used in convention source links do not select preferred versions.

| Technology | Decision state | Official starting points | Compatibility and coverage to establish |
| --- | --- | --- | --- |
| Java | Candidate; no decision | [Oracle support roadmap](https://www.oracle.com/java/technologies/java-se-support-roadmap.html) as one vendor-specific example | Chosen JDK distribution/provider, license/support coverage, compiler target, build/runtime tuple; Oracle terms do not define all distributions |
| Spring | Candidate; no decision | [Spring support policy](https://spring.io/support-policy/), [Boot system requirements](https://docs.spring.io/spring-boot/system-requirements.html) | Selected projects/release train, JDK/build compatibility, community versus contracted coverage, client dependencies |
| Angular | Candidate; no decision | [Release policy](https://angular.dev/reference/releases), [version compatibility](https://angular.dev/reference/versions) | Angular/Node.js/TypeScript/RxJS tuple, browser support, build toolchain, update path |
| PostgreSQL | Candidate; no decision | [Versioning policy](https://www.postgresql.org/support/versioning/) | Server/distribution, drivers, extensions, migration/backup method, hosting-specific coverage |
| Python | Candidate; no decision | [Supported version lifecycle](https://devguide.python.org/versions/), [packaging project metadata](https://packaging.python.org/en/latest/guides/writing-pyproject-toml/) | Interpreter implementation/build, native/system dependencies, packaging/resolution tools, relevant framework support |
| Keycloak | Candidate; no decision | [Downloads](https://www.keycloak.org/downloads), [upgrade guide](https://www.keycloak.org/docs/latest/upgrading/index.html) | Runtime/database support, provider/distribution, adapters/extensions/themes, release-to-release migration; a download alone proves no support window |
| Valkey | Candidate; no decision | [Release and compatibility policy](https://valkey.io/topics/releases/) | Server/client commands/protocol, scripts/modules, persistence formats, topology/failover, provider coverage |

## Recording the outcome

Use the [support decision template](../templates/technology-support-decision.md) to create an ADR with metadata type technology-support-decision. The support framework owns the obligations; that record supplies their approved parameter values. Replace the decision-state cell above with a link after the record exists; keep product/version/classification parameters in that source record rather than duplicating its version table here. Source facts and proposed team policy must be distinguishable.

Use [technology conventions](README.md), shared standards, and relevant workload profiles to design the pilot. Missing support evidence remains unresolved even if documentation checks pass.
