---
{
  "id": "REPLACE-001",
  "title": "REPLACE: technology support decision",
  "type": "technology-support-decision",
  "status": "draft",
  "revision": 1,
  "owner": "Software Engineering team",
  "classification": "internal",
  "authors": [
    "REPLACE_WITH_AUTHOR"
  ],
  "created": "2026-10-23",
  "updated": "2026-10-23",
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
    "GOV-010"
  ],
  "requirements": [],
  "requires": [
    "GOV-TECH-001",
    "GOV-TECH-002",
    "GOV-TECH-003",
    "GOV-TECH-004",
    "GOV-TECH-005"
  ],
  "supersedes": []
}
---

# REPLACE: technology support decision

> Draft template. Allocate an unused ARC document ID, replace every placeholder, set applicability/dates, and keep approvals empty until real review. Set technologies to every affected selector and workloads to the applicable specialized profiles, or empty for all workloads. This is not an adopted support choice.

## Context and intended role

State the application uses, constraints, decision owner/update owner, and boundary between central policy and application-specific choices. Apply GOV-TECH-001 through GOV-TECH-005 in the [source governance](../governance/technology-support.md); fix relative links when copying this template under architecture/decisions/.

## Parameter authority and discovery

This record supplies product/use, version, classification, and update-policy parameters under the referenced support requirements. Keep requirements empty; additional obligations belong in a requirements-bearing source. Classify this record as technology-support-decision so matching consumers assess restrictions and prohibitions even when they would not voluntarily adopt an ordinary ADR.

Explain how the metadata and stated product/distribution/role conditions identify affected consumers. Document how overlapping records resolve through scoped precedence or supersession, including retained historical records. A missing or unresolved support choice remains a gap. Exceptions cite the owning requirement plus this decision ID, released digest, and exact constraint.

## Alternatives and decision

Compare credible product/distribution/version choices. State the chosen scope and rationale, accepted tradeoffs, and unresolved blockers.

| Field | Decision to complete |
| --- | --- |
| Product and distribution/provider | REPLACE |
| Intended role and consumer scope | REPLACE |
| Proposed support classification | REPLACE: preferred, permitted, restricted, retiring, or prohibited; candidate until approved/released |
| Allowed version constraints | REPLACE |
| Exact tested patch/build identities | REPLACE |
| License and actual support coverage | REPLACE, or explicitly unknown |
| Patch/minor update policy | REPLACE: allowed change, evidence, and new-review triggers |
| Update owner and review date | REPLACE |
| Prior decision / supersession | REPLACE, or none |

## Dated lifecycle and compatibility evidence

For each source record the official URL, date checked, edition/distribution, support phase/end date if known, and whether coverage is community, vendor, or contracted. Record the actual entitlement if relevant using a safe reference. Do not copy restricted commercial or credential material here.

| Component tuple | Allowed combination | Tested exact inputs | Official compatibility evidence | Gaps/constraints |
| --- | --- | --- | --- | --- |
| REPLACE | REPLACE | REPLACE | REPLACE | REPLACE |

## Pilot and failure evidence

Link an isolated application's immutable source/input identities and meaningful build, security, failure, upgrade, and recovery results. Distinguish executed tests from pending plans. State what this evidence does and does not cover.

## Consumer impact and retirement

Identify affected requirements/profiles/apps, standards compatibility, migration steps, deadlines with rationale, recovery, and any separately reviewed exceptions. Preserve prior released decisions. Record how consumers discover and pin the new approved decision after release.

## Review outcome

List unresolved issues and required engineering/security reviewers. Do not invent approval evidence. Use the existing lifecycle; an agent may prepare the record but cannot grant approval.
