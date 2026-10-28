---
{
  "id": "STD-006",
  "title": "Reliable execution and recovery",
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
    "STD-004",
    "STD-005"
  ],
  "requirements": [
    "REL-WORK-001",
    "REL-WORK-002",
    "REL-WORK-003",
    "REL-WORK-004",
    "REL-WORK-005",
    "REL-WORK-006",
    "REL-WORK-007"
  ],
  "requires": [
    "DATA-STORE-003",
    "INT-CONTRACT-002"
  ],
  "supersedes": []
}
---

# Reliable execution and recovery

> Draft for Software Engineering team review. These are proposed requirements and guidance, not an approved standard.

## Scope

Apply to synchronous dependency calls, schedulers, batches, and message consumers. Each rule is conditional on the behavior it governs; a simple stateless function does not need a job repository. Select concrete budgets and recovery targets from application objectives, rather than adopting universal numeric defaults.

### REL-WORK-001 — Explicit time and capacity budgets

Applications MUST define end-to-end time/completion budgets and bound relevant connection waits, operation durations, worker concurrency, queues, pools, and payload processing. Downstream work fits the remaining caller/job budget. Define how overload is rejected, delayed, or shed before a dependency backlog becomes unbounded.

Evidence: configuration inventory, dependency-outage behavior, and representative saturation measurements.

### REL-WORK-002 — Bounded classified retries

Retries MUST identify retryable failures, one accountable retry layer per boundary, attempt and elapsed-time limits, delay/backoff behavior, and escalation. Use jitter when concurrent retries could amplify a shared failure. Do not automatically retry invalid input, permanent authorization failures, or uncertain non-idempotent effects without a safe recovery mechanism.

Evidence: transient, permanent, and ambiguous-outcome scenarios showing bounded attempts and no multiplication across nested retry layers.

### REL-WORK-003 — Idempotent effects and duplicate handling

Work that can be retried or redelivered MUST define a stable operation identity, duplicate scope/retention, concurrent-duplicate behavior, and the evidence of completed effects. When duplicate prevention depends on durable state, coordinate that state atomically with the business update or document another justified mechanism. Claims of exactly-once behavior name their actual boundary and proof; transport features alone do not establish it.

Evidence: simultaneous duplicates and a crash after commit but before response/acknowledgment, verifying business effects rather than just response equality. HTTP idempotence concerns the intended effect; a response can differ on repetition. [HTTP retry semantics](https://www.rfc-editor.org/rfc/rfc9110.html).

### REL-WORK-004 — Exclusive or safely concurrent work

Overlapping work on the same logical operation MUST have an explicit policy: prevent overlap, partition it, or make concurrent execution safe. For leases/locks, define ownership, lease expiry, stale-worker protection, and recovery. A process-local lock or cache lease is not assumed to protect independently running instances. Scheduler rules include time zone, daylight-saving transitions, missed triggers, and catch-up behavior.

Evidence: two competing workers, a paused/stale worker resuming, and an overlapping schedule scenario.

### REL-WORK-005 — Restartable progress

Long-running or chunked work MUST define input identity/version, checkpoints, atomic progress boundaries, and a restart/reconciliation procedure. Checkpoint advancement follows the committed effects it represents. Distinguish retrying a failed chunk from deliberately rerunning completed work. Define handling of invalid records without silently treating loss as success.

Evidence: interruption at chunk boundaries and replay against the same input. Framework job state and business state can use different transactions, so restart features need application-level analysis. [Spring Batch transaction configuration](https://docs.spring.io/spring-batch/reference/step/chunk-oriented-processing/configuring.html) and [restart behavior](https://docs.spring.io/spring-batch/reference/step/chunk-oriented-processing/restart.html).

### REL-WORK-006 — Durable acceptance and acknowledgment

Message consumers and asynchronous handoffs MUST state when ownership transfers and what acknowledgment means. Do not mark successful completion before required effects are durable. Where publication and a database update cannot commit atomically, use a reviewed durable handoff/reconciliation design. Failed or poison work needs an accountable terminal state, bounded quarantine/retry behavior, and a controlled replay path.

Evidence: failure immediately before and after commit, publish, and acknowledgment; verify redelivery and reconciliation behavior.

### REL-WORK-007 — Shutdown and operational recovery

Applications MUST stop admitting new work, account for in-flight work, and define drain/termination behavior. Runbooks describe recovery from abandoned work, partial effects, and exhausted retries using scoped authorized actions. Cancellation or process termination does not imply a remote effect was undone.

Evidence: forced termination and restart, with observed pending-work recovery and safe operational commands.

## Storage and integration responsibilities

Transaction mechanics remain owned by DATA-STORE-003. Contract compatibility remains owned by INT-CONTRACT-002. This standard owns execution semantics and the boundaries that combine them.

## Decisions for review

Choose concrete retry budgets, scheduler technology, broker guarantees, checkpoint mechanism, and operational ownership in each application's architecture. A broker and distributed lock product remain unselected.
