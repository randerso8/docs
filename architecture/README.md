---
{
  "id": "ARC-001",
  "title": "Architecture scope and decision backlog",
  "type": "guide",
  "status": "draft",
  "revision": 5,
  "owner": "Software Engineering team",
  "classification": "internal",
  "authors": [
    "ai-assisted-bootstrap",
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
    "GOV-001",
    "GOV-002"
  ],
  "requirements": [],
  "requires": [],
  "supersedes": []
}
---

# Architecture scope and decision backlog

> Draft for Software Engineering team review. This document is not an approved standard.

## Read the architecture proposal

Start with [engineering principles](principles/engineering-principles.md), then the [application and workload reference architecture](reference-architectures/application-and-workloads.md). These drafts explain capability boundaries, dependency direction, deployment tradeoffs, side-effect completion, and review evidence.

The reference architecture now includes a [responsibility map](reference-architectures/application-and-workloads.md#responsibility-map) for frontend, BFF, API, integration, processing, scheduling, batch, and consumer roles, plus [representative walkthroughs](reference-architectures/application-and-workloads.md#representative-review-walkthroughs). These are proposed allocations under the shared principles, not required deployments or universal folder layouts.

## What belongs here

Use principles/ for shared architecture criteria, reference-architectures/ for reusable views, and decisions/ for reviewed shared choices. Application-specific diagrams and local ADRs remain in application repositories. No approved central ADR exists yet.

## Open architecture choices

Supported versions, deployment topology, browser/session design, identity realm/tenant layout, messaging platform, and Valkey use cases remain unresolved. Record choices with alternatives and consequences rather than treating the reference diagram as a deployed architecture.


## Worked reference scenario

The [REST/background validation-job example](reference-architectures/validation-job-example.md) adds a concrete contract, responsibility mapping, state semantics, SQL sketches, UI recovery, and runtime verification plan. It is a draft design fixture, not an implemented application.

## Navigation and authority

Links here are a reading/progress index, not additional implementation obligations or approval prerequisites. Resolve actual source dependencies and lifecycle through the catalog and pinned release. A linked draft remains draft.
