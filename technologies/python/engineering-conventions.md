---
{
  "id": "TECH-011",
  "title": "Python engineering conventions",
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
      "python"
    ],
    "workloads": []
  },
  "required_approvals": [
    "engineering"
  ],
  "approvals": [],
  "depends_on": [
    "GOV-010",
    "ARC-002",
    "STD-009",
    "STD-006",
    "STD-002",
    "STD-005"
  ],
  "requirements": [
    "PY-CODE-001",
    "PY-CODE-002",
    "PY-CODE-003",
    "PY-CODE-004",
    "PY-CODE-005",
    "PY-CODE-006",
    "PY-CODE-007"
  ],
  "requires": [
    "ARC-DESIGN-002",
    "DEL-BUILD-001",
    "DEL-BUILD-002",
    "REL-WORK-001",
    "REL-WORK-007",
    "SEC-BASE-007",
    "INT-CONTRACT-005"
  ],
  "supersedes": []
}
---

# Python engineering conventions

> Draft for Software Engineering team review. Proposed guidance; no formal approval, supported product selection, or runtime certification is implied.

## Applicability and authority

Apply to Python services, CLI tools, schedulers, batch processors, and consumers. Shared requirements remain in the [central standards](../../standards/README.md); this document adds Python implementation conventions. No web framework, package manager, formatter, deployment model, or interpreter distribution is selected. Read the [support decision framework](../../governance/technology-support.md) before selecting a toolchain.

### PY-CODE-001 — Importable packages and explicit entry points

Python applications MUST provide an installable package and explicit executable entry points, with capability boundaries consistent with ARC-DESIGN-002. Use project metadata appropriate to the selected packaging mechanism, normally pyproject.toml. Importing a module must not start a scheduler, connect to a service, launch threads, or perform business work. Avoid dependence on the caller's current directory or ad hoc sys.path modification. Keep command/service composition separate from reusable rules.

Evidence: install into a clean environment, invoke the entry point outside the source directory, and import representative modules without external effects. See the [Python packaging guide](https://packaging.python.org/en/latest/guides/writing-pyproject-toml/).

### PY-CODE-002 — Recreated interpreter and dependency environments

The project MUST declare supported interpreter constraints, the selected dependency resolution/locking mechanism, and instructions to recreate development and test environments. Capture interpreter implementation/version and native/system dependencies where they affect artifacts. Do not commit a virtual environment or assume copying one reproduces it. A virtual environment isolates installed packages; it does not itself lock dependency versions or establish a security sandbox.

Evidence: another engineer recreates and tests the project from declared inputs. DEL-BUILD-001 and DEL-BUILD-002 own build provenance and dependency/update policy. [venv documentation](https://docs.python.org/3/library/venv.html) describes disposable environment behavior.

### PY-CODE-003 — Typed boundaries and runtime invariants

Public Python interfaces and application data carriers MUST describe input/output types, permitted absence, and relevant invariants. Check external values at runtime before using them as trusted domain values. Select and run a compatible static checker where annotations are relied upon; annotations alone are not runtime validation. Mutable dataclass defaults use a factory or equivalent per-instance construction. A frozen dataclass does not deeply freeze mutable referenced objects.

Evidence: static-check output plus invalid-input, missing-value, and shared-mutable-state tests. The [typing documentation](https://docs.python.org/3.14/library/typing.html) distinguishes annotations from runtime enforcement; [dataclasses](https://docs.python.org/3.14/library/dataclasses.html) explains generated methods and defaults.

### PY-CODE-004 — Owned resources and context management

Code acquiring an owned file, connection, client session, executor, or asynchronous resource MUST release it on success, failure, and cancellation. Use synchronous/asynchronous context managers when the actual library contract supports them. Define the lifetime of shared resources at application composition; do not close borrowed resources unexpectedly. Cleanup errors must not silently erase the primary failure or turn failed work into success.

Evidence: resource cleanup after an exception and after cancellation, including a borrowed-resource case. See [contextlib](https://docs.python.org/3.14/library/contextlib.html).

### PY-CODE-005 — Structured asynchronous execution and cancellation

Asynchronous Python code MUST retain ownership of spawned tasks, bound outstanding work, and define task failure/shutdown behavior. Use TaskGroup or an equivalent explicit task supervision mechanism supported by the selected interpreter. Propagate CancelledError after required cleanup unless a deliberate higher-level contract handles cancellation. Do not run blocking database, file, or HTTP work directly on the event loop; use a compatible async client or a deliberately bounded offload mechanism. Cancelling an await or offloaded thread wrapper does not prove that a thread, remote call, or external side effect stopped.

Evidence: task failure, overload, cancellation during I/O, and clean shutdown checks. REL-WORK-001 and REL-WORK-007 own execution budgets and recovery. The [asyncio task documentation](https://docs.python.org/3/library/asyncio-task.html) describes cancellation and structured task behavior. TaskGroup availability must be checked against the selected interpreter.

### PY-CODE-006 — Observable failures and truthful process outcomes

Python adapters MUST translate domain outcomes and technical exceptions deliberately, retain useful causes internally, and return an unsuccessful process/job outcome when required work failed. Use exception chaining when translating an exception. Do not suppress a broad exception and report success; do not catch BaseException indiscriminately, as it also covers process-control and cancellation cases. External error text, exception representations, and logs follow SEC-BASE-007.

Evidence: domain rejection, unavailable dependency, unexpected exception, and cancellation paths produce the intended safe output, exit/job outcome, and diagnostic cause.

### PY-CODE-007 — Explicit temporal and decimal values

Python values MUST implement INT-CONTRACT-005 consistently across JSON, persistence, and domain rules. Represent instants using aware datetimes with a stated normalization policy; retain a separate business zone when rules depend on it. Distinguish dates and local wall times from instants. Inject a clock callable or equivalent for time-sensitive rules. Use Decimal with explicit rounding/context for exact decimal domains, constructing intended decimal literals from exact text rather than a binary float approximation.

Evidence: fixed-clock boundaries, relevant zone transitions, and decimal round trips. See [datetime](https://docs.python.org/3.14/library/datetime.html) and [decimal](https://docs.python.org/3.14/library/decimal.html).

## Candidate package layout

A small validation capability could contain domain rules, application use cases, inbound CLI/HTTP adapters, outbound persistence adapters, and a composition module under one installed package. Tests can mirror meaningful behavior without recreating the production folder tree. A service, CLI, and batch entry point may reuse the same use cases while owning different lifecycle contracts.

## Review and verification

| Scenario | Evidence expected before adoption |
| --- | --- |
| Fresh environment | Install, import, and invoke the declared entry point with pinned inputs |
| Invalid external data | Runtime rejection without trusting annotations alone |
| Cancellation or child-task failure | Cleanup, observed failure, and no unowned background task |
| Dependency outage | Bounded wait and truthful CLI/job/API outcome |
| Time/decimal boundary | Deterministic rule and serialization checks |

Official references checked on 2026-10-23. Reference editions and moving documentation pages do not select an approved runtime version. Recheck the documentation for the version actually selected. Requirements above are proposed team conventions.
