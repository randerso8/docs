---
{
  "id": "STD-007",
  "title": "Operational observability",
  "type": "standard",
  "status": "draft",
  "revision": 2,
  "owner": "Software Engineering team",
  "classification": "internal",
  "authors": [
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
    "STD-002",
    "STD-003",
    "STD-006"
  ],
  "requirements": [
    "OBS-OPER-001",
    "OBS-OPER-002",
    "OBS-OPER-003",
    "OBS-OPER-004",
    "OBS-OPER-005"
  ],
  "requires": [
    "SEC-BASE-007",
    "IAM-CORE-005"
  ],
  "supersedes": []
}
---

# Operational observability

> Draft for Software Engineering team review. These are proposed requirements and guidance, not an approved standard.

## Scope

Apply to workload behavior that operators need to understand. Signals answer whether work is succeeding, which users/business operations are affected, and where a failure occurred. No monitoring vendor, exporter, sampling rate, or universal retention period is chosen here.

### OBS-OPER-001 — Stable workload identity and correlation

Telemetry MUST identify application, environment, deployed version, and workload/operation using documented stable fields. Connect synchronous requests and asynchronous work through safe correlation where useful. Validate external correlation inputs and bound their size. Correlation is diagnostic context, not authenticated identity.

Evidence: a synthetic operation followed across the actual relevant boundaries without recording a credential. An API-to-job-to-worker trace is one example when those components exist; a standalone processor can correlate its run and dependency activity.

### OBS-OPER-002 — Signals tied to outcomes

Applications MUST measure success/failure and duration or completion lag for important operations, with capacity/backlog signals where relevant. Distinguish accepted work from completed work. Define the service/job objective each signal supports, its aggregation, and who acts on deterioration. A high count of accepted jobs does not demonstrate completed processing.

Evidence: a dashboard or local report showing a normal run, a failed run, and stalled background work.

### OBS-OPER-003 — Meaningful health and readiness

Services MUST distinguish process health from readiness to receive new work and from health of completed business operations. Document dependency effects, failure thresholds, startup behavior, and safe degradation. Avoid recovery loops in which a shared dependency outage causes every otherwise healthy process to restart.

Evidence: startup and dependency-outage tests plus a description of what each health signal actually means.

### OBS-OPER-004 — Controlled telemetry cost and context

Telemetry producers MUST bound event volume, attribute size, and metric-label cardinality. Use stable route/operation categories rather than unbounded raw user IDs, URLs, or payload-derived labels. Review sampling/export behavior and failure of the telemetry path so instrumentation does not become an unbounded workload.

Evidence: representative load and exporter-outage behavior. Common semantic naming can improve cross-language analysis, but convention stability must be assessed before adoption. [OpenTelemetry semantic conventions](https://opentelemetry.io/docs/concepts/semantic-conventions/).

### OBS-OPER-005 — Actionable investigation and audit

Failures needing operator action MUST have an accountable owner, an investigation path, and safe context linking to a runbook. Distinguish operational logs from security/business audit records and define access/retention for both. Apply SEC-BASE-007 to every signal and diagnostic path; use IAM-CORE-005 for workload attribution.

Evidence: an operator can determine the affected operation, known outcome, and next authorized action from synthetic records and the runbook. [OpenTelemetry sensitive-data handling](https://opentelemetry.io/docs/security/handling-sensitive-data/) informs collection controls.

## Adoption and decisions

Agree on naming, objectives, cardinality budgets, retention, audit obligations, and tool integration per application. OpenTelemetry is a candidate interoperability approach, not a selected organization-wide backend.
