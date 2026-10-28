---
{
  "id": "GOV-001",
  "title": "Authority and ownership",
  "type": "governance",
  "status": "draft",
  "revision": 3,
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
  "depends_on": [],
  "requirements": [
    "GOV-AUTH-001",
    "GOV-AUTH-002",
    "GOV-AUTH-003"
  ],
  "requires": [],
  "supersedes": []
}
---

# Authority and ownership

> Draft for Software Engineering team review. This document is not an approved standard.

## Scope

Software Engineering is accountable for architecture, standards, security, releases, and exceptions. Individuals act in delegated roles; a single owning team does not remove independent review.

### GOV-AUTH-001 — One requirement owner

Every normative requirement MUST have a stable identifier and exactly one authoritative source document. Complete wording belongs under a heading with that ID. Other documents reference the ID through requires metadata and link to its source. IDs are never reassigned to unrelated obligations. MUST denotes an obligation; SHOULD permits a documented justified deviation; MAY permits a choice. A SHOULD deviation records the reason, consequences, alternative, supporting evidence, and accountable review. It cannot waive a separate MUST or a condition that the source makes mandatory. A relaxation of an applicable MUST needs an approved exception.

### GOV-AUTH-002 — Authority and conflicts

Only approved content, and explicitly deprecated content retained for existing use, selected in a pinned standards release establishes central obligations. Drafts and retired records do not establish new obligations. Applications can add constraints. Relaxations of applicable mandatory obligations MUST use an approved exception. A justified SHOULD deviation follows GOV-AUTH-001; absence of a source condition is non-applicability, not a relaxation. A specific profile, technology guide, pattern, or ADR does not override shared guidance automatically. Resolve conflicting approved obligations before dependent implementation.

### GOV-AUTH-003 — Central and application boundaries

Shared requirements, reference architectures, and reusable patterns MUST remain central. Application architecture, topology, local decisions, runbooks, adoption manifests, compliance evidence, and scoped exception records MUST remain with the application. Promote reusable local guidance through central review rather than copying app-specific details centrally.

## Decision records

Central ADRs explain shared choices and reference affected requirements. Normative obligations remain in their owning requirements-bearing sources. When a source explicitly delegates parameter values to a decision, the decision supplies those values within that source's scope; it cannot create unrelated obligations or override shared requirements. Technology support decisions are a designated kind of ADR supplying product/use, version, classification, and update-policy parameters under the [support framework](technology-support.md). Their approved released values bind consumers through the owning requirements, not through new requirement IDs in the ADR. An approved decision and inconsistent source block release until reconciled. App ADRs explain local choices within the pinned baseline.

## Reading requirements and evidence

Read each requirement with its source scope, actor, conditions, and referenced owners. Document applicability selects material to assess; it does not mean every requirement applies to every component. A technology selected for one component does not impose that technology on other components.

An Evidence paragraph illustrates ways to demonstrate the requirement. It does not independently mandate the example's topology, product, workflow, or every listed scenario. Mandatory verification belongs in the requirement wording, with explicit conditions and MUST or SHOULD as appropriate. Alternate evidence must still demonstrate the actual obligation and explain its coverage and limits; calling evidence illustrative is not permission to omit required verification.

## Delegation

Record actual reviewer identities in repository.json when known. No personal accounts or authority grants are assumed during bootstrap.
