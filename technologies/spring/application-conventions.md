---
{
  "id": "TECH-009",
  "title": "Spring application conventions",
  "type": "technology",
  "status": "draft",
  "revision": 3,
  "owner": "Software Engineering team",
  "classification": "internal",
  "authors": [
    "ai-assisted-drafting"
  ],
  "created": "2026-10-23",
  "updated": "2026-10-28",
  "review_due": "2027-01-23",
  "applicability": {
    "technologies": [
      "spring"
    ],
    "workloads": []
  },
  "required_approvals": [
    "engineering",
    "security"
  ],
  "approvals": [],
  "depends_on": [
    "TECH-008",
    "STD-002",
    "STD-003",
    "STD-004",
    "STD-005",
    "STD-006",
    "STD-008",
    "STD-009"
  ],
  "requirements": [
    "SPRING-APP-001",
    "SPRING-APP-002",
    "SPRING-APP-003",
    "SPRING-APP-004",
    "SPRING-APP-005",
    "SPRING-APP-006",
    "SPRING-APP-007"
  ],
  "requires": [
    "DEL-BUILD-003",
    "SEC-BASE-003",
    "DATA-STORE-003",
    "INT-CONTRACT-003",
    "IAM-CORE-003",
    "REL-WORK-004",
    "REL-WORK-006",
    "TEST-EVID-003",
    "IAM-CORE-004"
  ],
  "supersedes": []
}
---

# Spring application conventions

> Draft for Software Engineering team review. Proposed guidance; no formal approval or runtime certification is implied.

## Applicability

Apply when Spring is selected. A service is not required to use Spring merely because it uses Java. Confirm the compatible JDK, Spring Boot, Framework, Security, persistence libraries, and web execution model before producing a runnable reference. The requirements below add framework-specific integration checks to the shared standards.

### SPRING-APP-001 — Explicit bean composition

Application-managed bean dependencies MUST be explicit through constructors or configuration/factory composition. Prefer constructor injection for required collaborators rather than hidden field injection or service-location access. Keep cycles visible and resolve responsibility problems rather than hiding them through laziness by default. Pure rules and values need not become Spring beans.

Evidence: a use case can be instantiated with its dependencies in a focused test. [Spring dependency injection](https://docs.spring.io/spring-framework/reference/core/beans/dependencies/factory-collaborators.html).

### SPRING-APP-002 — Validated configuration boundaries

Related application settings MUST be bound and validated as a coherent configuration contract, using ConfigurationProperties or an equivalent maintained mechanism for the selected version. Define types, units, required values, and override sources. Keep scattered Environment lookups and stringly typed settings out of business rules. Apply DEL-BUILD-003 and SEC-BASE-003 for environment configuration and secret references.

Evidence: missing, invalid, and overridden configuration tests that fail before affected work is accepted. [Spring Boot external configuration](https://docs.spring.io/spring-boot/reference/features/external-config.html).

### SPRING-APP-003 — Proven transaction interception and rollback

Spring transaction boundaries MUST be exercised through the actual configured transaction mechanism, with rollback behavior verified for relevant failure types. In proxy mode, self-invocation does not activate an annotated transactional method. Do not infer atomicity from an annotation alone, assume transaction state moves to another thread, or assume every checked exception causes rollback. DATA-STORE-003 owns the underlying atomicity/concurrency design.

Evidence: call the real managed boundary, force a failure after a write, then inspect durable state outside the test transaction. [Transactional interception](https://docs.spring.io/spring-framework/reference/data-access/transaction/declarative/annotations.html) and [rollback rules](https://docs.spring.io/spring-framework/reference/data-access/transaction/declarative/rolling-back.html).

### SPRING-APP-004 — Transport binding and exception mapping

Spring HTTP adapters MUST make request binding, validation, result/error mapping, and persistence-to-contract translation explicit. Keep controller advice or its execution-model equivalent responsible for predictable safe transport errors. Web-layer validation does not replace business invariants. Choose MVC/blocking versus reactive behavior explicitly; mixing blocking persistence into a reactive path needs a reviewed execution/capacity design.

Evidence: malformed/binding/constraint failures and domain errors through the actual HTTP boundary, including consistent INT-CONTRACT-003 behavior.

### SPRING-APP-005 — Explicit security-chain assurance

A Spring-protected application MUST define and test the effective security chain for intended routes, request types, and management surfaces. For bearer-token APIs, configure issuer, audience, key trust, and validators through maintained resource-server support or a justified alternative. Verify the checks required by IAM-CORE-003 rather than assuming issuer configuration also covers every audience requirement. Keep resource authorization in a context with the actual requested resource.

Evidence: unauthorized and invalid-token requests fail through the real filter chain, not just a mocked controller principal. Include management endpoints in the access inventory. When cookies or other browser-automatic credentials are used, test request-level CSRF defenses under IAM-CORE-004; CORS configuration or calling an API stateless is not sufficient justification to disable them. See [Spring CSRF guidance](https://docs.spring.io/spring-security/reference/servlet/exploits/csrf.html). [Spring resource-server configuration](https://docs.spring.io/spring-security/reference/servlet/oauth2/resource-server/jwt.html).

### SPRING-APP-006 — Managed task boundaries

Scheduled/asynchronous entry points MUST delegate to an identified use-case boundary, use owned execution capacity, and surface failures to an accountable observer. An Async invocation is not a durable queue, and a Scheduled method does not itself provide cross-instance exclusivity. Deliberately cross the required managed proxy/transaction boundary rather than relying on a same-instance method call. Apply REL-WORK-004 and REL-WORK-006 for ownership and durable acceptance.

Evidence: task failure, overlapping instances, executor saturation, and shutdown scenarios. [Spring task execution and scheduling](https://docs.spring.io/spring-framework/reference/integration/scheduling.html).

### SPRING-APP-007 — Tests that expose production boundaries

Spring verification MUST distinguish narrow web/data tests, full-context integration tests, and genuine cross-transaction behavior. Test-managed rollback must not hide missing commits, after-commit behavior, real database constraints, or work that another connection/thread cannot see. Flush/commit and inspect through independent boundaries where the scenario requires them.

Evidence: for database-backed behavior, representative commit-then-worker/reload and rollback inspections against the intended database. For a Spring application without database transactions, demonstrate its actual managed composition, configuration, execution, and integration boundaries without adding a database or worker to reproduce this example. TEST-EVID-003 owns representative-dependency evidence. [Spring test transaction management](https://docs.spring.io/spring-framework/reference/testing/testcontext-framework/tx.html).

## Candidate use-case arrangement

The web adapter invokes a managed submission service; a poll trigger invokes a separate managed worker service. Each service's public entry point establishes its reviewed transaction. Repository implementations handle SQL mechanics. This arrangement avoids treating controller lifetime or a scheduler annotation as the durable work record.

## Decisions before implementation approval

Select compatible product versions, blocking/reactive model, configuration conventions, transaction manager, SQL/JPA choice, migration tooling, security policy mapping, and worker budget. The [worked example](../../architecture/reference-architectures/validation-job-example.md) records a concrete candidate without approving those choices for all applications.
