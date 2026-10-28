---
{
  "id": "TECH-014",
  "title": "Valkey application conventions",
  "type": "technology",
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
      "valkey"
    ],
    "workloads": []
  },
  "required_approvals": [
    "engineering",
    "security"
  ],
  "approvals": [],
  "depends_on": [
    "GOV-010",
    "STD-004",
    "STD-006",
    "STD-002",
    "STD-003"
  ],
  "requirements": [
    "VK-STATE-001",
    "VK-STATE-002",
    "VK-STATE-003",
    "VK-STATE-004",
    "VK-STATE-005",
    "VK-STATE-006",
    "VK-STATE-007",
    "VK-STATE-008"
  ],
  "requires": [
    "DATA-STORE-001",
    "REL-WORK-006",
    "SEC-BASE-004",
    "SEC-BASE-006",
    "REL-WORK-001",
    "IAM-CORE-002",
    "REL-WORK-002",
    "REL-WORK-003",
    "DATA-STORE-006",
    "REL-WORK-004",
    "REL-WORK-005"
  ],
  "supersedes": []
}
---

# Valkey application conventions

> Draft for Software Engineering team review. Proposed guidance; no formal approval, supported product selection, or runtime certification is implied.

## Applicability and authority

Apply when Valkey stores cache, session, coordination, or messaging-related state. This document does not select any of those uses for an application. Shared [data](../../standards/data/persistence-and-migrations.md), [reliability](../../standards/reliability/execution-and-recovery.md), and [security](../../standards/security/application-security.md) standards own the underlying obligations. Server/client versions, standalone/cluster/Sentinel topology, persistence, and hosting require a [support decision](../../governance/technology-support.md).

### VK-STATE-001 — Keyspace purpose and loss contract

Every application use of Valkey MUST identify the purpose of each keyspace, its owner, authoritative source, allowed loss/staleness, and reconstruction or recovery path. Distinguish derived cache entries from session state, correctness-critical coordination, and durable work intent. Do not approve a correctness-critical use from cache availability evidence alone. DATA-STORE-001 owns data responsibility; REL-WORK-006 owns durable acceptance and acknowledgment.

Evidence: a use-case/keyspace inventory and the application's outcome after complete loss of that state. If loss is unacceptable, review the architecture and recovery evidence before adoption rather than silently treating Valkey as a durable database or broker.

### VK-STATE-002 — Namespaces, encodings, and access boundaries

Keys and values MUST have a documented namespace/version/encoding, tenant/resource scoping where relevant, and size/cardinality bounds. Avoid secrets or identifying payloads in key names. Use narrow command/key permissions and authenticated/encrypted connectivity under SEC-BASE-004 and SEC-BASE-006. A prefix convention alone does not enforce tenant authorization.

Evidence: collision/version migration cases, cross-tenant access checks, oversized values, and the actual runtime ACL. [Valkey ACL guidance](https://valkey.io/topics/acl/) describes command and key access controls.

### VK-STATE-003 — Expiration, memory pressure, and eviction

Each keyspace MUST specify expiry behavior, memory/eviction policy, and what the application does when an entry disappears early or a write is rejected. Plan capacity for values, metadata, replication/persistence overhead, and expected growth on the chosen topology. Separate workloads whose eviction/loss requirements cannot be met by one instance policy. Do not use an expiring key or expiry notification as an unreviewed durable scheduler/acknowledgment mechanism.

Evidence: expired/missing entry, selected-policy eviction, and memory-limit write failure under representative pressure. See [Valkey eviction guidance](https://valkey.io/topics/lru-cache/); limits and policies must be tested with the selected configuration.

### VK-STATE-004 — Cache consistency and miss/outage behavior

A cache integration MUST define key derivation, invalidation/versioning, permitted staleness, authorization scope, and behavior during misses, stampedes, or Valkey outages. Use bounded regeneration/concurrency appropriate to downstream capacity. Decide whether stale data may be returned for each use; do not serve previously authorized sensitive data under an unrelated tenant/principal. Do not assume updating a database and invalidating a cache form one atomic commit.

Evidence: concurrent misses, failed invalidation, an update racing a reader, stale authorization data, and total cache outage. REL-WORK-001 owns capacity/time budgets and IAM-CORE-002 owns authorization.

### VK-STATE-005 — Client concurrency and uncertain command outcomes

Valkey clients MUST have explicit connection/pool limits, timeouts, reconnect behavior, and operation-specific retry rules. Treat a lost write response as an uncertain outcome. Distinguish pipelining, atomic server operations, optimistic checks, and transactions, including cluster key-slot restrictions for the chosen operations. Do not assume MULTI/EXEC provides relational rollback: command errors during execution can coexist with other executed commands. Inspect per-command outcomes and restore/discard connection transaction state before reuse. REL-WORK-002 and REL-WORK-003 own bounded retries and duplicate effects.

Evidence: lost response, partial command error, failed optimistic check, and reconnect/failover cases on the actual client. [Valkey transactions](https://valkey.io/topics/transactions/) describes the difference between queue-time and execution-time errors.

### VK-STATE-006 — Persistence and failover evidence

A design relying on retained Valkey state MUST specify RDB/AOF/no-persistence choices, synchronization and restore settings, replica behavior, and the resulting acknowledged-loss and recovery boundaries. Test process/node loss and failover with the intended workload; an available replica is not proof of durable acknowledgment. WAIT/WAITAOF can improve acknowledged replication/persistence conditions but do not by themselves provide a strongly consistent failover system. DATA-STORE-006 owns recovery targets and restore evidence.

Evidence: a recorded fault/restore exercise and reconciliation of acknowledged operations after failure. See [persistence](https://valkey.io/topics/persistence/) and [replication guarantees](https://valkey.io/topics/replication/).

### VK-STATE-007 — Lease and lock correctness review

A proposed Valkey lock/lease MUST document the protected invariant, ownership/release rule, expiry/renewal, stale-owner behavior, process pauses, network partitions, and failover assumptions. If stale holders can produce invalid effects, enforce a fencing/version check at the protected resource or choose another mechanism with justified correctness. A random ownership value and safe compare-and-delete can prevent deleting a successor's key but do not alone stop a stale holder from writing elsewhere. REL-WORK-004 owns overlap/lease behavior.

Evidence: expired holder resumes after a successor, delayed release, lost renewal, and failover/partition cases. The upstream [distributed-lock page](https://valkey.io/topics/distlock/) is explicitly marked under review as of the source check. It is not accepted here as a verified recipe; no distributed-lock pattern is approved in this repository.

### VK-STATE-008 — Pub/Sub and Streams delivery semantics

Any use for work/event delivery MUST state required delivery/order/replay semantics and show how the selected Valkey mechanism meets them. Pub/Sub is at-most-once and loses messages for unavailable/disconnected subscribers. Streams requires explicit retention, consumer-group pending-entry handling, acknowledgment timing, abandoned-work recovery, duplicate handling, and backlog/lag controls; its existence does not establish exactly-once business effects. REL-WORK-005 and REL-WORK-006 own checkpoint and acknowledgment boundaries.

Evidence: subscriber disconnect, crash around processing/acknowledgment, pending work reclamation, duplicate delivery, and retention/trimming pressure as applicable. See [Pub/Sub semantics](https://valkey.io/topics/pubsub/) and [Streams](https://valkey.io/topics/streams-intro/).

## Review pack and limits

Include the keyspace/loss inventory, actual client/topology, namespace/ACL design, TTL/eviction settings, miss/retry paths, and use-specific failure evidence. No cache invalidation, distributed lock, session-store, durable-job, or message-consumer reference implementation has been validated. Synthetic local checks of these documents do not certify Valkey behavior.

Official references checked on 2026-10-23. Reference editions and moving documentation pages do not select an approved runtime version. Recheck the documentation for the version actually selected. Requirements above are proposed team conventions.
