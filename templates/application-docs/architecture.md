# Application architecture

## Ownership and scope

Record the accountable owner, capabilities, boundaries, and actual constraints. Identify the exact central release/commit and distinguish confirmed local decisions from proposals. Describe actual workload behavior and specialized profiles; explain a reviewed no-match selection where workloads is empty.

## Responsibilities and composition

| Component or capability | Role and public interface | Business/data/authorization responsibility | Actual technology and support decision | Execution and operating owner |
| --- | --- | --- | --- | --- |
| REPLACE | REPLACE with the actual role, not a required layer | REPLACE | REPLACE, or explain absence | REPLACE |

Describe only roles present in the application. A component can combine roles; a logical boundary need not be a deployment. Explain any BFF/API distinction, integration translation, processing entry point, scheduling, batch, or consumer responsibility that is present. Use the central reference architecture as review guidance, not a mandatory topology or folder layout.

## Interactions, state, and effects

Show the relevant trust transitions, contracts, consumers, identity/delegation, dependency direction, and capability interfaces. For state and effects, distinguish authoritative data, durable intent/progress, sessions, caches, and ephemeral state. Identify transaction boundaries, acceptance/completion meaning, uncertain remote outcomes, and authorized reconciliation. Record absent mechanisms explicitly where that determines requirement applicability.

## Objectives and operations

Record workload assumptions, completion/latency objectives, capacity, permitted loss, and recovery targets with units. Identify admission, resource ownership, shutdown, monitoring, deployment, backup/restore, and replay/correction responsibilities where applicable. Distinguish shared-platform evidence from application integration evidence, including actual owners and remaining gaps.

## Decisions and evidence

Link local ADRs, contracts, compliance/requirements.md, exceptions, runbooks, and recovery checks. Reference central source IDs and applicable support decision parameters. Select representative success/failure walkthroughs for actual behavior; do not add infrastructure to reproduce an example.

## Risks and open decisions

| Decision or gap | Affected boundary and dependent action | Central or application scope | Accountable owner | Proposed alternatives and evidence needed |
| --- | --- | --- | --- | --- |
| REPLACE | REPLACE | REPLACE | REPLACE | REPLACE; do not invent a decision |

Keep proposals distinct from actual decisions and record what can proceed independently. Application-specific design and migration details stay here; reusable central changes follow the central review process.
