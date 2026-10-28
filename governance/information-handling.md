---
{
  "id": "GOV-003",
  "title": "Internal information handling",
  "type": "governance",
  "status": "draft",
  "revision": 2,
  "owner": "Software Engineering team",
  "classification": "internal",
  "authors": [
    "ai-assisted-bootstrap"
  ],
  "created": "2026-10-23",
  "updated": "2026-10-24",
  "review_due": "2027-01-23",
  "applicability": {
    "technologies": [],
    "workloads": []
  },
  "required_approvals": [
    "engineering",
    "security"
  ],
  "approvals": [],
  "depends_on": [
    "GOV-001"
  ],
  "requirements": [
    "GOV-INFO-001",
    "GOV-INFO-002",
    "GOV-INFO-003"
  ],
  "requires": [],
  "supersedes": []
}
---

# Internal information handling

> Draft for Software Engineering team review. This document is not an approved standard.

## Classification

This repository is internal. Access control comes from authorized local filesystem/backup permissions or selected host permissions, accounts, and the authorized AI environment; classification labels alone do not restrict access. More restricted material belongs in separate controlled systems.

### GOV-INFO-001 — Prohibited content

Contributors and agents MUST NOT commit credentials, tokens, private keys, credential-bearing connection strings, production extracts, customer information or personal data beyond minimal work identifiers needed for accountable authorship/review, sensitive raw logs, or restricted incident and vulnerability evidence. This includes history, attachments, examples, indexes, and review comments. Use synthetic data and approved secret references.

### GOV-INFO-002 — Authorized systems

Internal content MUST remain in authorized private systems and organization-approved AI tools. Verify workspace permissions, data handling, and retention with the delegated reviewer before sending internal material to a new service. Local generation is not permission to upload or publish.

### GOV-INFO-003 — Exposure response

On discovering prohibited content, contributors MUST stop distribution and notify Software Engineering through its approved internal route. Rotate or revoke exposed credentials promptly. Coordinate history and cache cleanup with administrators and affected consumers; deleting the latest text is insufficient.

## Safe examples and evidence

Use invented identifiers and example.invalid domains in examples. Authorship and review records may contain the minimum verified work handle/internal identifier needed for accountability. Keep identity proof, contact details, personnel records, and unrelated personal data in restricted systems; a minimal work reference is not permission to copy those records here. Reference restricted evidence only through safe labels or IDs appropriate for this repository. Do not paste restricted evidence into an agent prompt to request sanitization.

## Validation limits

The offline scanner detects selected high-confidence secret indicators and blocked file names. It cannot find every credential, personal detail, or proprietary dataset. Manual review and host secret protection remain necessary.
