---
{
  "id": "TECH-008",
  "title": "Java engineering conventions",
  "type": "technology",
  "status": "draft",
  "revision": 1,
  "owner": "Software Engineering team",
  "classification": "internal",
  "authors": [
    "ai-assisted-drafting"
  ],
  "created": "2026-10-23",
  "updated": "2026-10-23",
  "review_due": "2027-01-23",
  "applicability": {
    "technologies": [
      "java"
    ],
    "workloads": []
  },
  "required_approvals": [
    "engineering"
  ],
  "approvals": [],
  "depends_on": [
    "ARC-002",
    "STD-002",
    "STD-005",
    "STD-006"
  ],
  "requirements": [
    "JAVA-CODE-001",
    "JAVA-CODE-002",
    "JAVA-CODE-003",
    "JAVA-CODE-004",
    "JAVA-CODE-005",
    "JAVA-CODE-006"
  ],
  "requires": [
    "ARC-DESIGN-002",
    "SEC-BASE-007",
    "REL-WORK-001",
    "INT-CONTRACT-005"
  ],
  "supersedes": []
}
---

# Java engineering conventions

> Draft for Software Engineering team review. Proposed guidance; no formal approval or runtime certification is implied.

## Applicability

Apply to Java implementation, whether or not Spring is used. Shared architecture, contracts, security, and reliability requirements remain authoritative in their [source standards](../../standards/README.md). This document adds language-specific conventions. Choose a supported JDK, build tool, dependency policy, and source compatibility explicitly before creating a runnable application.

### JAVA-CODE-001 — Package interfaces and visibility

Java capabilities MUST expose a deliberate public/package interface and keep implementation types and members as narrow as practical. Organize packages around capabilities first; use internal responsibility packages where they help. A Java subpackage is a separate package, so package-private access does not automatically span a nested feature tree. Test cross-capability dependencies rather than assuming the package names enforce them.

Evidence: a representative capability interface, visibility review, and dependency-boundary check. ARC-DESIGN-002 owns business/adapter separation.

### JAVA-CODE-002 — Explicit value and absence contracts

Public Java boundaries MUST use types that distinguish materially different identifiers and values, define permitted absence, and preserve invariants at construction or boundary validation. Prefer immutable value representations where they fit. Do not use an untyped map or null to carry several undocumented result meanings. Avoid leaking mutable collections or persistence state through value carriers. Records, if supported by the selected JDK, are shallow data carriers; they do not automatically make referenced collections immutable.

Evidence: invalid/absent-value cases and a test showing consumers cannot mutate an internal collection through a returned value.

### JAVA-CODE-003 — Deliberate exception translation

Java error handling MUST distinguish expected domain outcomes from technical failures, preserve causes at an appropriate internal boundary, and translate them to safe external error contracts in adapters. Do not swallow a failure, return an unexplained null, or log the same exception repeatedly at every layer. Error messages and generated toString output follow SEC-BASE-007. Checked versus unchecked exception policy must be compatible with the actual caller and transaction behavior.

Evidence: domain rejection, infrastructure failure, and translation tests with safe context and retained diagnostic causes.

### JAVA-CODE-004 — Resource and execution ownership

Code acquiring an owned stream, connection, executor, task, or other closeable resource MUST define who releases or terminates it on success, failure, and cancellation. Use try-with-resources where ownership and AutoCloseable semantics fit. Do not close a borrowed container-managed resource as though it were locally owned. Propagate interruption or restore the interrupted status when handling InterruptedException according to the surrounding contract; cancellation must not silently become success.

Evidence: failure/cancellation checks for a representative resource and explicit executor ownership. Capacity/time budgets remain owned by REL-WORK-001. The [AutoCloseable contract](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/lang/AutoCloseable.html) describes automatic closure and caveats.

### JAVA-CODE-005 — Time and exact-number semantics

Java implementations MUST select temporal and numeric types consistent with INT-CONTRACT-005. Distinguish an instant from a business date or a local wall-clock time; supply an explicit business zone when conversion needs one. Time-sensitive rules use an injectable Clock or equivalent controlled time source. For exact decimal domains, choose explicit decimal precision/rounding and avoid constructing an intended decimal literal from a binary floating-point approximation.

Evidence: fixed-clock boundary tests, relevant zone transitions, and exact-number cases. [Clock](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/time/Clock.html) supports controlled time; [BigDecimal](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/math/BigDecimal.html) documents precision and rounding behavior.

### JAVA-CODE-006 — Stable equality and collection behavior

Types used for equality, deduplication, or map/set keys MUST define stable equality/hash behavior for that use. Avoid mutable key fields and accidental entity-lifecycle-dependent equality. Decide when representation differences are significant: BigDecimal numerical comparison and equals are not interchangeable. Keep ordering and null-element behavior explicit at public collection boundaries.

Evidence: equal/distinct values, map/set retrieval, mutation hazards, and ordering cases appropriate to the type.

## Candidate capability layout

```text
com.example.validation
  domain          # rules and values
  application     # submit/query/process use cases
  adapter.in.web  # REST translation
  adapter.out.sql # persistence mechanisms
  configuration   # composition
```

This is a synthetic layout, not a required package for every application. A small capability can use fewer packages. No interface-per-class, mapping library, annotation processor, Lombok policy, ORM, or preview feature has been selected.

## Adoption and open choices

Confirm JDK vendor/support, compiler compatibility, build tool, formatting, nullness tooling, concurrency model, and dependency checks. Validate examples on that chosen toolchain before claiming they compile. See the [worked validation-job guide](../../architecture/reference-architectures/validation-job-example.md).

## Source notes

Official references checked on 2026-10-23. API documentation versions are reference editions, not an adopted runtime support matrix. The requirements are proposed team conventions.

- [Java language specification: records](https://docs.oracle.com/javase/specs/jls/se25/html/jls-8.html#jls-8.10)
- [Java Object equality and hash contract](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/lang/Object.html)
