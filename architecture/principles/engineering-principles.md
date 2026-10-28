---
{
  "id": "ARC-002",
  "title": "Engineering architecture principles",
  "type": "standard",
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
    "technologies": [],
    "workloads": []
  },
  "required_approvals": [
    "engineering"
  ],
  "approvals": [],
  "depends_on": [
    "GOV-001"
  ],
  "requirements": [
    "ARC-DESIGN-001",
    "ARC-DESIGN-002",
    "ARC-DESIGN-003",
    "ARC-DESIGN-004",
    "ARC-DESIGN-005",
    "ARC-DESIGN-006"
  ],
  "requires": [],
  "supersedes": []
}
---

# Engineering architecture principles

> Draft for Software Engineering team review. These are proposed requirements and guidance, not an approved standard.

## Scope and intent

These principles apply to application code, browser applications, integration services, and background workloads. They define review criteria while leaving deployment and framework choices to explicit decisions. Keep the implementation proportional to its actual constraints.

### ARC-DESIGN-001 — Cohesive capability boundaries

Applications MUST identify their business capabilities, each capability's responsibilities and the interfaces exposed to other capabilities. Other modules use those interfaces instead of reaching into internal implementation. A capability can be a module inside one process; a boundary does not require a separately deployed service.

Evidence: a capability/context view, dependency map, and examples of permitted cross-module interaction.

### ARC-DESIGN-002 — Business rules separated from adapters

Business rules MUST remain testable without starting a browser, HTTP server, identity provider, or database. Transport adapters translate external requests; use cases coordinate business operations; persistence and integration adapters handle external mechanisms. Dependencies follow these responsibilities rather than making core rules depend on a particular transport or vendor. Introduce abstractions where they protect a real boundary, rather than an interface for every class.

Evidence: representative rule tests and a dependency check or focused review showing that adapters can change without rewriting business rules.

### ARC-DESIGN-003 — Justified deployment complexity

Teams SHOULD use the smallest deployment topology meeting documented ownership, scaling, security, recovery, and delivery needs. A new independently deployed component MUST have a recorded reason, its operational owner, interaction contract, and failure implications. Neither a monolith nor microservices are mandated by this proposal.

Evidence: an application ADR comparing at least the simpler viable alternative with the proposed split.

### ARC-DESIGN-004 — Explicit side-effect boundaries

Each use case with state changes MUST identify its authoritative data store, transaction boundary, external effects, and the point at which callers can safely regard the operation as complete. Distinguish durable acceptance from successful completion. Do not imply one atomic transaction spans a database and an unrelated external service.

Evidence: a sequence showing commit, failure, timeout, and reconciliation points.

### ARC-DESIGN-005 — Objectives before infrastructure choices

Applications MUST document expected workload, acceptable latency or completion window, availability needs, data-loss tolerance, and recovery targets before selecting infrastructure intended to meet them. State assumptions and measurement units. Product names and framework defaults do not establish service objectives.

Evidence: an application-owned quality-attribute table linked to the relevant architecture decisions and verification plan.

### ARC-DESIGN-006 — Decisions with accountable rationale

Material architecture choices MUST record context, credible alternatives, consequences, uncertainty, and an accountable owner in an application or central ADR as appropriate. Separate confirmed constraints from proposals. Generated explanations require the same review as manually authored explanations.

Evidence: ADRs for consequential boundaries, persistence, identity, and delivery choices; small reversible choices can remain in ordinary review notes.

## Rationale and adoption

The reference architecture uses these principles without selecting a cloud, broker, database-per-service rule, or package convention. For an existing application, begin by recording actual boundaries and dependency problems, then improve a representative slice before broad restructuring.

## Decisions for review

Confirm which choices require ADRs and which dependency checks fit each language. No extra framework is required merely to demonstrate modularity.

## References

Public sources checked on 2026-10-23. These inform the proposal; they do not approve organization policy or select product versions.

- [Spring Modulith module concepts and provided/required interfaces](https://docs.spring.io/spring-modulith/reference/fundamentals.html)
