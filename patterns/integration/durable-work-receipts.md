---
{
  "id": "PAT-002",
  "title": "Durable receipts for recoverable work",
  "type": "implementation-pattern",
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
    "technologies": [
      "postgresql"
    ],
    "workloads": []
  },
  "required_approvals": [
    "engineering",
    "security"
  ],
  "approvals": [],
  "depends_on": [
    "STD-003",
    "STD-004",
    "STD-005",
    "STD-006"
  ],
  "requirements": [],
  "requires": [
    "REL-WORK-003",
    "REL-WORK-004",
    "REL-WORK-005",
    "REL-WORK-006",
    "REL-WORK-007",
    "DATA-STORE-001",
    "DATA-STORE-003",
    "INT-CONTRACT-001",
    "IAM-CORE-002"
  ],
  "supersedes": []
}
---

# Durable receipts for recoverable work

> Draft for Software Engineering team review. These are proposed requirements and guidance, not an approved standard.

## Applicability and limits

Candidate pattern for business effects that can be atomically recorded with a durable receipt in the same PostgreSQL transaction. It can support message consumers, scheduled work, batch items, or retryable commands. It is a draft design with no validated reference implementation yet. It does not make an unrelated external service atomic with PostgreSQL or guarantee exactly-once network delivery.

## Requirements addressed

The pattern illustrates REL-WORK-003, REL-WORK-005, REL-WORK-006, and DATA-STORE-003. Input identity is part of INT-CONTRACT-001. Access to prior results remains subject to IAM-CORE-002. Source requirements own the obligations; the steps below describe a candidate implementation.

## Candidate data model

| Record | Illustrative fields | Purpose |
| --- | --- | --- |
| Processing receipt | scoped operation key, input fingerprint, outcome reference, completion time | Identify one logical operation and its committed outcome |
| Business record | application-specific state | Persist the effect |
| Optional outbox record | event identity, safe payload/reference, publish state | Record an intended downstream handoff alongside the effect |

Use a database-enforced unique operation key, scoped by relevant application, tenant, operation type, and caller/business context. Choose an input fingerprint representation and retention policy explicitly. Do not put access tokens or raw sensitive payloads into keys or receipts. Receipt expiry must be considered together with the maximum retry/replay horizon.

## Candidate processing sequence

1. Authenticate where applicable, validate the operation identity and input, and authorize access before exposing an existing result.
2. Begin a transaction and attempt the unique receipt claim inside it. A prior committed receipt can return its authorized outcome if the input fingerprint agrees. Conflicting reuse of the same key for different input becomes a contract conflict, not a new effect.
3. Perform the business state change in that transaction and finish the receipt with its durable outcome reference. If downstream publication is required, write an outbox entry in that same transaction.
4. Commit. Only afterward report committed completion or acknowledge the input. A crash before acknowledgment can cause redelivery, which resolves through the receipt rather than repeating the effect.
5. An optional dispatcher publishes committed outbox entries and records progress. Publication can be repeated after an ambiguous outcome; the receiver uses its own operation identity/deduplication or another reviewed recovery mechanism.

A separate committed 'in progress' claim introduces leases and abandoned-claim recovery; it is a different design requiring REL-WORK-004 analysis. The simple same-transaction receipt does not solve long-running ownership by itself.

## Failure and concurrency review

| Failure point | Expected candidate behavior |
| --- | --- |
| Before the transaction commits | Receipt and business effect roll back together |
| Two workers claim the same key | Database uniqueness arbitrates; completed outcome or conflict is resolved without a second effect |
| After commit, before reply/ack | Retry finds the committed receipt |
| Publish succeeds, dispatcher crashes before recording it | A duplicate publish is possible; downstream handling remains safe |
| External call times out after possible remote success | Treat outcome as uncertain; reconcile or use provider-supported idempotency rather than blindly repeating |
| Receipt expires while replay is still possible | Duplicate protection is no longer proven; retention/replay policy needs correction |

## Verification before approval

Test simultaneous duplicates, input/key conflicts, unauthorized replay of another principal's outcome, process death at each boundary, rollback, dispatcher replay, and receipt retention. Assert actual business effects and pending work. Verify DATA-STORE-001 constraints and REL-WORK-007 operational recovery. A worked reference implementation and failure evidence are still needed before this becomes an approved pattern.

## Alternatives and open decisions

For external-only effects, use the provider's explicit idempotency/reconciliation contract if available. For naturally idempotent state replacement, a receipt may add unnecessary cost. Choose operation identity, fingerprinting, retention, outbox ordering/capacity, and operational ownership from application needs. [PostgreSQL constraints](https://www.postgresql.org/docs/18/ddl-constraints.html) support uniqueness; they do not establish cross-system exactly-once delivery.
