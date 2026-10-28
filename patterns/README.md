---
{
  "id": "PAT-001",
  "title": "Implementation pattern approval",
  "type": "guide",
  "status": "draft",
  "revision": 4,
  "owner": "Software Engineering team",
  "classification": "internal",
  "authors": [
    "ai-assisted-bootstrap",
    "ai-assisted-drafting"
  ],
  "created": "2026-10-23",
  "updated": "2026-10-24",
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
    "GOV-001",
    "GOV-007"
  ],
  "requirements": [],
  "requires": [],
  "supersedes": []
}
---

# Implementation pattern approval

> Draft for Software Engineering team review. This document is not an approved standard.

## Draft candidate patterns

| Pattern | Scope | Evidence still needed |
| --- | --- | --- |
| [REST request pipeline](application/rest-request-pipeline.md) | Request boundaries in Java/Spring or Python, optionally used by Angular | A framework-specific example and real boundary tests |
| [Durable work receipts](integration/durable-work-receipts.md) | Database-owned effects across retryable commands, scheduling, batch, or messages | Reference implementation and concurrency/crash/replay evidence |

These are proposed designs, not approved implementations. They reference requirement owners and expose assumptions, failure boundaries, alternatives, and verification cases.

## Short database-owned work

The [short background work candidate](operations/short-database-work-queue.md) keeps a bounded claim, database-owned effect, and terminal transition in one transaction. Its assumptions and limits are illustrated by the synthetic worked example; PostgreSQL runtime/concurrency evidence remains pending.

## Promotion

A pattern becomes eligible for approval only after representative implementation evidence is reviewed. Keep app-specific settings, topology, and runbooks in the application repository. A conceptual diagram or generated code sample is insufficient evidence by itself.

## Navigation and authority

Links here are a reading/progress index, not additional implementation obligations or approval prerequisites. Resolve actual source dependencies and lifecycle through the catalog and pinned release. A linked draft remains draft.
