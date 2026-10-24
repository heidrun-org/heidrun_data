# Four Scenarios for Understanding Existing Code

- Created: 24 October 2026
- Last updated: 24 October 2026
- Status: Product and marketing discussion summary
- Related framing: [Heidrun Data repository](../../README.md)
- Related issue: [Heidrun Data — code understanding, historical intelligence and active optimization](https://github.com/heidrun-org/heidrun_notebook/issues/169)

## Purpose

This document expands the four original scenarios for using Heidrun Data to understand an existing codebase. Each scenario begins with a question a developer may ask and describes the evidence Heidrun Data can gather, the answer it can prepare, and the limits it should make clear.

These scenarios describe passive analysis. Heidrun Data searches and relates information that already exists. It does not need to run or modify the software to answer these questions. The scenarios are proposals, not claims that every capability is implemented today.

## Shared foundation

The useful answer is rarely contained in one source. Heidrun Data can connect information from:

- Source code and its structure.
- Git commits, dates, authors, branches, and changed files.
- GitHub issues, pull requests, descriptions, and comments.
- Conversations between developers and coding agents.
- Static analysis results, such as code relationships and dependencies.
- Where available, recorded tests, measurements, and previous experiment results.

Finding related records is not the same as proving a reason. Heidrun Data should distinguish a confirmed fact from a likely connection, an interpretation, or missing information. Important statements should link to the original records so a developer can check them.

## Scenario 1: Explain a technical decision

### The developer's question

“Why did we choose this technology or design?”

Examples include:

- Why does this project use SQLite?
- Why was this service split into two modules?
- Why does this function handle a special case?
- Which alternatives were considered before this dependency was added?

### What Heidrun Data investigates

Heidrun Data starts with the technology, component, file, function, or design named in the question. It searches for related conversations and technical records, then follows links to the relevant issues, pull requests, commits, and code changes. It orders the evidence in time to identify the discussion closest to the decision.

The first mention of a technology can be a useful search clue, but it is not proof that a decision was made then or for a particular reason. Heidrun Data must inspect the surrounding discussion and corroborating records.

### What the answer contains

A useful answer separates:

- **Decision:** what was selected or changed.
- **Reason:** the reason people actually stated, if one can be found.
- **Alternatives:** options discussed and what was said about them.
- **Context:** the date, participants, and related project need.
- **Evidence:** links to the original conversation, issue, pull request, commit, or code.
- **Unknowns:** details that the available records do not establish.

For example, an answer might say that a project chose a local database to avoid operating another service, then link to the discussion and the change that introduced it. That is only an example of the answer format; the system must use the reasons found in the project's actual records.

### When evidence is missing

If the code and history show when a technology appeared but no source explains why, Heidrun Data should say that it found the adoption but not its justification. It should not turn a plausible technical explanation into a historical fact.

### Value

This scenario helps developers understand constraints before proposing a replacement or redesign. It also helps new team members find the reasoning behind decisions without relying only on the memory of the person who made them.

## Scenario 2: Find previous attempts

### The developer's question

“What have we already tried to solve this problem?”

Examples include:

- Have we already tried to speed up this function?
- Why was the earlier caching change removed?
- Which fixes were attempted for this recurring bug?
- Was a migration proposed, implemented, or only discussed?

### What Heidrun Data investigates

Heidrun Data searches conversations, issues, pull requests, commits, and code history for attempts related to the problem, module, or function. It reconstructs each attempt as a sequence where possible: the problem, proposed idea, implementation, evaluation, and final decision.

It distinguishes among:

1. **Suggestion:** someone proposed an approach.
2. **Implemented attempt:** a code change was made.
3. **Evaluated result:** tests, measurements, or observed behavior were recorded.
4. **Decision:** the change was kept, revised, or rejected.

A proposal in a conversation does not prove that the change was implemented. A merged change does not, by itself, prove that the intended result was achieved.

### What the answer contains

For each attempt, the answer can include:

- The problem being addressed.
- The proposed approach and who proposed it.
- Whether the approach was implemented.
- The code changes and linked project records.
- Test results or performance measurements, if recorded.
- The outcome and the stated reason for keeping or rejecting the change.
- Any uncertainty or missing evaluation evidence.

The answer may present attempts in chronological order so the developer can see how understanding of the problem changed.

### How to handle failed attempts

Rejected and unsuccessful attempts are useful history. Heidrun Data should preserve what was tried and why it did not meet the need, while making clear that an old failure does not prove the same approach will fail under current code, data, or constraints.

### Value

This scenario can prevent repeated investigation and help developers avoid repeating an approach without understanding its earlier outcome. It also preserves lessons from changes that were rolled back or abandoned.

## Scenario 3: Reconstruct a module's history

### The developer's question

“Tell me the history of this module and what I should know before changing it.”

Examples include:

- How did the authentication module develop?
- What major changes shaped the import pipeline?
- Which constraints still affect this service?
- What should a new team member understand about this component?

### What Heidrun Data investigates

This is a broader report rather than a narrow lookup. Heidrun Data identifies the relevant files, functions, and dependencies, then gathers their Git history and related issues, pull requests, conversations, and recorded experiments. It organizes the findings into a timeline and connects major code changes to the needs and decisions that led to them when evidence exists.

The investigation may include:

- The module's origin and early purpose.
- Major changes and the records that introduced them.
- Technical choices and alternatives.
- Bugs, incidents, and recurring concerns.
- Previous experiments and their results.
- Dependencies and known constraints.
- Questions that remain unanswered in the available history.

### What the answer contains

A module history report can be organized into:

1. **Summary:** what the module does today, based on the current code.
2. **Origin:** when and why it appears to have been introduced, with sources.
3. **Timeline:** major changes and the issues, pull requests, commits, or discussions behind them.
4. **Decisions and constraints:** reasons that were explicitly recorded and alternatives that were considered.
5. **Attempts and outcomes:** relevant fixes, migrations, or optimizations, including rejected attempts.
6. **Current relationships:** important dependencies found in the code and static analysis.
7. **Open questions:** areas where records are missing, conflicting, or too weak to support a conclusion.

Each important historical claim should point to its source. The current behavior should be checked against current code rather than inferred only from old discussions.

### Scope and limits

A complete history may require searching many records and can take longer than a direct question. A generated report is only as complete as the imported history and the relationships that can be established. Dynamic behavior and undocumented decisions may not be visible in static records.

### Value

This scenario supports onboarding, maintenance, architecture reviews, and work on unfamiliar areas of a codebase. It gives a developer both a current map and a traceable account of how the module reached its present state.

## Scenario 4: Estimate the impact of a change

### The developer's question

“If I change this function, what could be affected?”

Examples include:

- Which parts of the application call this function?
- Could changing token validation affect login or session renewal?
- Are there historical constraints on this dependency?
- Which tests or components should I examine before editing this code?

### What Heidrun Data investigates

Static analysis can identify code relationships without running the program. Heidrun Data can use dependency and call information to find direct and indirect callers or related modules. It can then add relevant history: earlier bugs, decisions, pull requests, conversations, and attempts associated with those elements.

The result combines two kinds of information:

- **Structural impact:** relationships found in source code and static analysis.
- **Historical context:** decisions, defects, constraints, and earlier changes found in project records.

### What the answer contains

A useful impact report can include:

- The selected function, file, or module.
- Direct and indirect dependants found by analysis.
- The application areas that those dependants appear to serve, where this is established.
- Related historical decisions, bugs, or changes.
- Suggested tests or records to review, when the source material supports them.
- The analysis limits and any uncertain relationships.

For example, the report might show that a validation function is called by request authentication and session renewal, and link to a previous change that introduced a special case. The report should label these as identified relationships and historical context, not as a guarantee that every runtime effect has been found.

### Scope and limits

Static analysis estimates potential impact; it does not prove that all effects have been found. Dynamic calls, reflection, generated code, configuration, and external services can hide relationships. Execution and tests may be needed to validate a proposed code change, but they are outside this passive scenario.

### Value

This scenario helps a developer choose what to inspect before making a change. Historical context can explain why a dependency exists and what previous changes were intended to protect.

## How the four scenarios fit together

The four questions address different needs:

| Scenario | Main question | Main result |
| --- | --- | --- |
| Technical decision | Why did we choose this? | Evidence-backed explanation of a decision and its alternatives. |
| Previous attempts | What have we tried? | A traceable account of proposals, changes, evaluations, and outcomes. |
| Module history | How did this part of the system evolve? | A sourced timeline and current context for a module. |
| Change impact | What could this edit affect? | A dependency estimate enriched with historical context. |

A developer may combine them. Before changing a module, the developer could read its history, ask why a key design was chosen, check which attempts were made to address a known problem, and estimate which other components could be affected.

All four are passive analysis. Code Spine's profiling and optimization loop is a separate active workflow: it runs the software, measures behavior, tests changes, and can later send experiment records to Heidrun Data. Those measurements can enrich the historical answers, but they are not required for the four original scenarios.

## Shared answer principles

Across all four scenarios, Heidrun Data should:

- Separate retrieved facts from interpretation and uncertainty.
- Link important statements to original evidence.
- Say when records do not answer the question.
- Distinguish discussion, implementation, evaluation, and confirmed outcome.
- Treat static dependency analysis as an estimate, not a guarantee.
- Avoid inventing motivations, results, or causal links that the records do not support.
