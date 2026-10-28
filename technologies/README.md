---
{
  "id": "GUIDE-001",
  "title": "Technology discovery",
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
    "GOV-007"
  ],
  "requirements": [],
  "requires": [],
  "supersedes": []
}
---

# Technology discovery

> Draft for Software Engineering team review. This document is not an approved standard.

## Concrete convention drafts

| Technology | Guidance | State |
| --- | --- | --- |
| Java | [Engineering conventions](java/engineering-conventions.md) | Draft language-level conventions |
| Spring | [Application conventions](spring/application-conventions.md) | Draft framework integration and verification |
| Angular | [Application conventions](angular/application-conventions.md) | Draft feature, async state, HTTP, accessibility, and lifecycle |
| PostgreSQL | [Application conventions](postgresql/application-conventions.md) | Draft roles, migrations, transactions, queries, types, row security, and operations |
| Python | [Engineering conventions](python/engineering-conventions.md) | Draft packaging, types, resources, async/cancellation, errors, and values |
| Keycloak | [Application conventions](keycloak/application-conventions.md) | Draft clients, claims, issuer/proxy trust, lifecycle, upgrades, and administration |
| Valkey | [Application conventions](valkey/application-conventions.md) | Draft keyspaces, eviction, caching, commands, persistence, locks, and delivery |

The [worked validation-job guide](../architecture/reference-architectures/validation-job-example.md) connects Java/Spring, Angular, and PostgreSQL without selecting an approved product version or browser-session architecture.

## Discovery and support

Select technologies actually used by the application, then read their applicable shared standards and workload profiles. Use the [support intake index](support-status.md), [decision framework](../governance/technology-support.md), and [decision template](../templates/technology-support-decision.md) to prepare version choices. A reference edition in a source link is not an adopted runtime support policy. All guidance remains draft, and actual application evidence belongs with the application.

## Navigation and authority

Links here are a reading/progress index, not additional implementation obligations or approval prerequisites. Resolve actual source dependencies and lifecycle through the catalog and pinned release. A linked draft remains draft.
