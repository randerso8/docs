---
{
  "id": "GOV-005",
  "title": "Scoped exceptions",
  "type": "governance",
  "status": "draft",
  "revision": 1,
  "owner": "Software Engineering team",
  "classification": "internal",
  "authors": [
    "ai-assisted-bootstrap"
  ],
  "created": "2026-10-23",
  "updated": "2026-10-23",
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
    "GOV-002",
    "GOV-003",
    "GOV-004"
  ],
  "requirements": [
    "GOV-EXC-001",
    "GOV-EXC-002"
  ],
  "requires": [],
  "supersedes": []
}
---

# Scoped exceptions

> Draft for Software Engineering team review. This document is not an approved standard.

## Record ownership

Applications keep exception records beside their local compliance evidence. The central repository owns the process and schema rather than duplicating app-specific records.

### GOV-EXC-001 — Scope and expiry

An exception MUST identify application, owner, pinned baseline, requirement IDs, rationale, risk, compensating controls, remediation, expiry, approval evidence, and digest. It applies only to that recorded scope and baseline and does not amend the central obligation.

### GOV-EXC-002 — Approval and renewal

Software Engineering MUST approve independently of the author. Security-related exceptions require security-role review. Expiry blocks claiming compliance for the affected requirement. Renewal needs fresh approval and evidence; never extend automatically.

## Workflow

Copy the exception JSON template into the application repository, resolve IDs against its baseline, and document remediation. Application CI validates schema, scope, expiry, digest, and authorized approval against the locked release. Central validation covers central content only.
