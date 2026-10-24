# Heidrun Data Team

- Created: 24 October 2026
- Last updated: 24 October 2026
- Status: Product discussion summary and proposal
- Related framing: [Heidrun Data repository](../../README.md)
- Related issue: [Heidrun Data — code understanding, historical intelligence and active optimization](https://github.com/heidrun-org/heidrun_notebook/issues/169)

## Purpose

Heidrun Data Team extends Heidrun Data to the shared knowledge of a team or organization. It aims to preserve useful development knowledge across people and over time, while applying clear access and privacy rules.

This document records the proposal discussed in [issue 169](https://github.com/heidrun-org/heidrun_notebook/issues/169). It describes a direction, not an implemented product or a delivery commitment.

## The problem

Important development knowledge is spread across source code, Git history, GitHub issues and pull requests, and conversations with developers and coding agents. A person may know why a design was chosen, which alternatives were considered, or why an earlier attempt failed, even when the code does not explain those facts.

When a person leaves a team, that knowledge can become difficult to find or disappear from everyday use. Heidrun Data Team proposes to collect and connect relevant records so the team can keep using its shared history.

The employee departure example expresses the intended value of the proposal. The issue describes collective knowledge and team data collection, but does not explicitly confirm that example as a requirement.

## Proposed responsibilities

Heidrun Data remains the knowledge and analysis service. Heidrun Data Team extends the scope and governance of the data that Heidrun Data can handle. It is not a separate analysis engine.

The proposal includes:

- Collecting conversations from team members.
- Sharing knowledge by repository.
- Keeping a collective history of technical decisions.
- Recording optimization experiments from different developers, including attempts that were rejected and the evidence for their outcomes.
- Managing access to shared information.
- Isolating data between organizations and applying privacy rules.

The proposed knowledge sources include Git, GitHub, coding-agent conversations, and source code. Code Spine could add execution profiles, performance measurements, changes, test outcomes, and optimization decisions. Code Spine would run its active optimization loop near the development environment and send experiment records to Heidrun Data asynchronously.

## Example: keeping the reason behind a design decision

1. A developer and a coding agent discuss how to store project data. They consider SQLite and another option, and explain the reasons for their choice in the conversation.
2. The change is recorded in Git and may also be linked to an issue or pull request.
3. Heidrun Data Team collects the permitted conversation and project records, then connects them to the relevant repository and code changes.
4. Later, another team member asks why the project uses that storage design. Heidrun Data searches the connected records and provides an explanation with links to the original evidence.
5. If the original developer has left, the team can still consult the recorded discussion, subject to its access and privacy rules.

This example describes a proposed workflow. The records must support the explanation; the system should not present an assumption as a reason that people actually gave.

## Example: remembering an optimization attempt

1. Code Spine measures a slow part of a program and proposes a change.
2. It applies the change in a controlled environment, runs the relevant tests, and measures performance again.
3. If the change fails tests or does not meet the objective, Code Spine rejects it and records why. If the change succeeds, it records the measured result and the accepted change.
4. Code Spine sends the experiment record and its evidence to Heidrun Data. The local optimization loop does not need to wait for that transfer.
5. A later developer can ask what has already been tried and review the measurements, tests, and decision before repeating the work.

The performance values and outcomes in this example are not claims about measured results in a particular repository.

## Product boundaries

| Component | Proposed responsibility |
| --- | --- |
| Heidrun Data | Collect, connect, store, and analyze project knowledge; provide historical answers with evidence. |
| Heidrun Data Team | Extend the data scope to a team or organization and define sharing, access, isolation, and privacy rules. |
| Heidrun Code | Provide the developer interface and request historical analysis or start an active optimization. |
| Code Spine | Profile and modify software, run tests, compare measurements, and accept or reject optimization attempts. |
| Heidrun Notebook | Remain a separate product; an integration through plugins is optional and is not an architectural requirement here. |

Heidrun Data may own stored static-analysis results and dependency information. Code Spine may reuse those results, while remaining responsible for active profiling and optimization. The proposal aims to avoid building two independent analysis systems that produce the same information.

## Value to a team

The main proposed value is continuity of technical knowledge. Team members can find earlier decisions, attempts, constraints, and evidence without depending only on the recollection of the person who did the work.

This can support onboarding, maintenance, architecture reviews, and work after a team member leaves. It also provides a concrete product message: preserve and retrieve the team's development knowledge over time. The commercial value still needs validation with users and teams.

## Open points

- Which conversations and project records may be collected, and how do team members control that collection?
- How are organization boundaries, repository access, retention, and deletion handled?
- How are personal information and confidential material filtered or protected?
- How are conversation records connected reliably to issues, pull requests, commits, and code?
- What evidence is required before a historical answer can be presented as a confirmed decision or result?
- How does the team evaluate whether shared historical context saves time or prevents repeated work?
