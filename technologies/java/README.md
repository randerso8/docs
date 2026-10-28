---
{
  "id": "TECH-001",
  "title": "Java guidance scope",
  "type": "technology",
  "status": "draft",
  "revision": 3,
  "owner": "Software Engineering team",
  "classification": "internal",
  "authors": [
    "ai-assisted-bootstrap"
  ],
  "created": "2026-10-23",
  "updated": "2026-10-24",
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
    "GOV-001",
    "GOV-007"
  ],
  "requirements": [],
  "requires": [],
  "supersedes": []
}
---

# Java guidance scope

> Draft for Software Engineering team review. This document is not an approved standard.

## Implementation guidance

Read [Java engineering conventions](engineering-conventions.md) for concrete proposed conventions, source requirements, and evidence expectations. The [worked REST/background example](../../architecture/reference-architectures/validation-job-example.md) shows one synthetic application of the guidance.

## Supported scope

JDK support, builds, concurrency, dependency boundaries, and tests; coordinate framework compatibility.

## Open choices

Runtime/product versions and support windows remain unapproved. Choose compatible versions using current official vendor sources before compiling a reference application. The draft conventions do not mandate a framework for unrelated workloads or claim a validated implementation.

## Approval evidence

Review the convention requirements and execute representative application tests against the selected toolchain. Record results in the pilot application before pattern approval.

## Discovery boundary

This landing page links the substantive convention owner; it does not own additional technical requirements or make all linked examples prerequisites. Follow the selected technology convention and its actual source dependencies for implementation.
