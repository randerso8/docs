# Read the engineering documentation

This is the Software Engineering team's internal architecture and engineering manual in development. It covers multiple application types and enduring system guidance. All governed sources are currently drafts; no approved standards release exists. Use them for review and explicitly authorized proposal work, without claiming approved policy or application compliance. The [roadmap](governance/implementation-roadmap.md) separates draft progress from decisions still required.

## Establish the task and authority

For an application task, begin with the application's primary instructions, architecture, adoption manifest, exact standards lock, local ADRs, and exceptions. Use [application adoption](governance/application-adoption.md) and the [catalog](catalog/documents.json) from that pinned snapshot to establish the baseline and dependency/requirement-owner closure. A missing or mismatched pin blocks dependent authority/compliance claims; it is not permission to substitute current drafts. For central documentation work, read [AGENTS.md](AGENTS.md), [authority and ownership](governance/authority-and-ownership.md), and the owning source before editing.

Identify the requested outcome, affected components, actual behavior, interfaces, state/effects, and constraints. Then use a route below to locate the task's governing sources and their prerequisites. These routes are reading aids, not replacement applicability rules or permission to omit baseline obligations. An unfamiliar task or changed boundary can require expanding the reading set.

## Choose a task route

| Task | Start with | Resolve before dependent changes |
| --- | --- | --- |
| Identify capability or application responsibilities | [Principles](architecture/principles/engineering-principles.md), [responsibility map](architecture/reference-architectures/application-and-workloads.md#responsibility-map), local architecture/ADRs | Capability ownership, public interfaces, dependency direction, and justification for any deployment split |
| Change an API, SOAP, message, file, or outbound contract | [Contracts](standards/api-and-integration/contracts-and-compatibility.md), matching [REST](workload-profiles/rest-api.md), [SOAP](workload-profiles/soap-service.md), or [consumer](workload-profiles/message-consumer.md) profile | Actual consumers, compatibility, validation, completion meaning, identity and error boundaries; follow referenced security/identity/reliability sources |
| Change an application UI or BFF interaction | [Role distinctions](architecture/reference-architectures/application-and-workloads.md#responsibility-map), [identity](standards/identity-and-access/identity-and-authorization.md), [contracts](standards/api-and-integration/contracts-and-compatibility.md), [Angular](technologies/angular/application-conventions.md) when selected | Approved local session design, presentation versus business ownership, resource authorization, asynchronous UI state, and affected contract evidence |
| Fix processing, scheduling, restart, retries, or message handling | [Reliability](standards/reliability/execution-and-recovery.md), actual [scheduler](workload-profiles/scheduler.md), [batch](workload-profiles/batch-processor.md), or [consumer](workload-profiles/message-consumer.md) profiles | Work identity, execution authority, capacity, commit/checkpoint/acknowledgment boundaries, duplicate or uncertain effects, and authorized recovery |
| Change a schema or persistent query | [Persistence](standards/data/persistence-and-migrations.md), [PostgreSQL](technologies/postgresql/application-conventions.md) when selected, [delivery](standards/delivery/build-and-change-control.md) | Data owner, invariant/concurrency behavior, migration compatibility, runtime privileges, and recovery evidence |
| Change identity, access, or sensitive-data handling | [Security](standards/security/application-security.md), [identity](standards/identity-and-access/identity-and-authorization.md), [Keycloak](technologies/keycloak/application-conventions.md) when selected | Trust model, principal/resource context, delegation, secret and transport policy, and denied-access/outage evidence |
| Change a runtime, dependency, configuration, or operating procedure | [Support decisions](governance/technology-support.md), [delivery](standards/delivery/build-and-change-control.md), [observability](standards/observability/operational-signals.md), applicable technology conventions | Released support parameters, exact inputs, configuration ownership, operating responsibilities, compatibility, and recovery |
| Review or extend central guidance | [Ownership](governance/authority-and-ownership.md), [authoring](governance/authoring-and-discovery.md), owning requirement source, [templates](templates/README.md) | Existing authority, consumer impact, parameter versus obligation ownership, unresolved decisions, and required human review |

Every route uses [verification evidence](standards/testing/verification-evidence.md) for the affected obligations. Read the source requirements, not only these route summaries. Applicability is assessed per actor/component and condition; Evidence paragraphs illustrate proof without mandating the example's topology.

## Select behavior and technology guidance

Describe actual workloads and select every matching specialized profile. The supported profiles are REST, SOAP, scheduling, batch, and message consumption; they compose when an application performs several kinds of work. A standalone processor with no matching specialized profile retains the shared baseline and records a reviewed no-match rationale under [adoption](governance/application-adoption.md). Empty application selection does not mean universal scope or waive requirements.

Choose only technologies actually used, then read their conventions and source dependencies:

| Technology | Detailed conventions |
| --- | --- |
| Java | [Language and package boundaries, values, resources, and errors](technologies/java/engineering-conventions.md) |
| Spring | [Composition, configuration, transactions, security, and execution](technologies/spring/application-conventions.md) |
| Angular | [Features, UI state, HTTP, lifecycle, and accessibility](technologies/angular/application-conventions.md) |
| Python | [Packaging, typed boundaries, resources, cancellation, and process outcomes](technologies/python/engineering-conventions.md) |
| PostgreSQL | [Roles, migrations, transactions, queries, types, and recovery](technologies/postgresql/application-conventions.md) |
| Keycloak | [Clients, claims, trust, sessions, administration, and recovery](technologies/keycloak/application-conventions.md) |
| Valkey | [Keyspace purpose, loss, cache consistency, coordination, and delivery](technologies/valkey/application-conventions.md) |

The [support intake index](technologies/support-status.md) helps locate product evidence and support parameter decisions. Matching technology-support-decision records, including restrictions and prohibitions, participate in discovery. No product versions are approved yet. Technology names do not select a topology, browser/session model, storage role, or workload framework.

## Vocabulary and authority

| Term | Meaning for navigation |
| --- | --- |
| Application | An accountable engineering/adoption scope that may contain several components; not necessarily one process or repository |
| Component | A part with identified responsibilities and interfaces; a logical component need not be separately deployed |
| Capability | A cohesive business responsibility and its public interfaces; not merely a protocol endpoint or technical layer |
| Workload | Actual execution behavior, including entry points/triggers, lifetime, state, and effects |
| Workload profile | A specialized selection of concerns for matching behavior; multiple profiles can compose |
| Standard or technology convention | A requirements-bearing source with stable owned IDs; technology-specific wording does not silently override shared obligations |
| Pattern | A reusable candidate implementation approach with assumptions and limits; optional unless adopted or required by an applicable source |
| Example | An illustration or fixture whose bounded choices do not become universal requirements |
| ADR | A record of context, alternatives, choice, and consequences; local ADRs remain within the pinned baseline |
| Support decision | A designated ADR supplying product/use/version parameters under centrally owned support requirements |

The [authority source](governance/authority-and-ownership.md) owns interpretation of MUST, SHOULD, MAY, evidence examples, and conflicts. Conditions determine applicability; justified SHOULD deviations and exceptions have different treatment. The [lifecycle](governance/document-lifecycle.md) determines whether a document can establish released authority. Drafts and examples do not establish approved obligations.

## Bound a task and report evidence

1. Identify the component, requested behavior, local decisions, and exact baseline. Establish whole-application adoption if it does not already exist; a task route alone cannot establish it.
2. Locate affected requirement owners through the catalog and routes, then read their source scope and dependencies. Consider neighboring contracts, consumers, data ownership, trust, and recovery affected by the change.
3. Record which requirements apply to the task and why. Keep unrelated baseline duties intact; a bounded task is not an assessment of the entire application's compliance.
4. Identify required decisions and verification before dependent work. Continue authorized independent work when a separate decision is pending; do not invent a trust arrangement, approval, version choice, or exception.
5. Verify the affected behavior at meaningful boundaries and update application-local evidence, ADRs, contracts, or runbooks as appropriate. Preserve observed results and limitations.
6. Report the result, affected components and source IDs, evidence actually obtained, dispositions, unresolved decisions, and next owner/action. Use the [application assessment template](templates/application-docs/compliance/requirements.md) where a durable record is needed.

Seek clarification when a material choice is unresolved, approved obligations conflict, a required source is inaccessible, or the available evidence cannot establish the needed boundary. Identify exactly which action or claim depends on the answer. Small reversible implementation choices already covered by the task and applicable guidance can remain in ordinary review notes.

## Examples and deeper review

The [reference architecture](architecture/reference-architectures/application-and-workloads.md#representative-review-walkthroughs) contains balanced review walkthroughs for browser/API interaction, standalone processing, scheduled/restartable batch, and external integration/message consumption. They are responsibility and discovery aids, not application designs or validated blueprints.

The [REST request pipeline](patterns/application/rest-request-pipeline.md), [durable receipts](patterns/integration/durable-work-receipts.md), and [short database work](patterns/operations/short-database-work-queue.md) are candidate patterns with distinct assumptions. The [worked validation job](architecture/reference-architectures/validation-job-example.md) and [source pack](examples/validation-job/README.md) illustrate one REST/background arrangement. They do not settle browser/session design or cover general long-running and external-effect workflows. Runtime verification remains pending.

For a broad technical review, read principles and the responsibility map, security/identity, data/contracts, reliability, observability/testing/delivery, then the technologies and profiles in scope. The [roadmap](governance/implementation-roadmap.md) records focused reviews, team decisions, and future document reconciliation. The [prior self-audit](reviews/audits/2026-10-24/README.md) is historical review evidence, not approval.

## Local working information

Use [README.md](README.md) for repository structure and checks, [AGENTS.md](AGENTS.md) for maintenance behavior, and the [catalog](catalog/documents.json) for source discovery. Local drafting does not require a Git host. Optional hosting remains inactive. Formal approval and release follow the separate [local review/release procedure](governance/local-review-and-release.md).
