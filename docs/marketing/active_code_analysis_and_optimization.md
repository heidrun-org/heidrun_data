# Active Code Analysis and Optimization with Code Spine

- Created: 24 October 2026
- Last updated: 24 October 2026
- Status: Product and marketing discussion summary
- Related framing: [Heidrun Data repository](../../README.md)
- Related issue: [Heidrun Data — code understanding, historical intelligence and active optimization](https://github.com/heidrun-org/heidrun_notebook/issues/169)

## Purpose

This document describes the proposed active-analysis workflow built around Code Spine and its relationship to Heidrun Data. The workflow does more than inspect records that already exist: it runs the software, measures its behavior, tests a code change, and compares the result.

The proposal is to use actual measurements to guide optimization, preserve the original behavior through validation, and record the experiment so that its evidence can become part of the project's history. This is a product direction, not a statement that an integrated workflow is already implemented.

## The question this workflow answers

A developer may ask:

> Can this part of the software be made faster while keeping its behavior?

A useful result is not just a code suggestion. It includes a measured baseline, a specific hypothesis, the code change, the test outcome, comparable measurements after the change, and a clear decision to keep or reject the change.

## Three kinds of knowledge and analysis

**Historical project records** include Git history, GitHub collaboration, conversations between developers and coding agents, and previously recorded experiments. Heidrun Data connects these records to explain decisions, find earlier attempts, and reconstruct how a module changed over time. Historical analysis can be performed after the events have happened; it does not require running the program.

**Static code analysis** is a distinct source of knowledge. It examines source code without executing the program and derives structural facts, such as dependencies and call relationships. It can be run on a code snapshot today, even if the code was written months earlier. It describes the structure of the analyzed code; by itself, it does not explain the historical reasons for that structure.

**Active runtime analysis** requires a suitable environment in which the software can run. Code Spine profiles the program, identifies where execution time is spent, supports an optimization attempt, runs tests, measures again, and compares the result. The active loop depends on the project's runtime, test setup, representative input, and measurement conditions.

These knowledge types can inform each other. Historical records can tell Code Spine about constraints and earlier attempts. Static code analysis can provide structural context. Active experiments can produce new measurements and outcomes for Heidrun Data to retain.

## Proposed responsibilities

| Component | Responsibility in this workflow |
| --- | --- |
| Heidrun Code | Gives the developer an interface to select a target and request historical context or an optimization. |
| Code Spine | Runs the local optimization loop: profile, identify bottlenecks, guide changes, test, measure again, and accept or reject an attempt. |
| Heidrun Data | Stores and relates project history and experiment records, then makes that knowledge available to later analysis. |

Code Spine should work near the development environment so it can iterate without waiting for remote historical processing. It can send experiment records to Heidrun Data asynchronously. A temporary delay in that transfer should not stop the local optimization loop.

Static code analysis and dependency information may be shared. Heidrun Data can retain indexed results, while Code Spine can reuse them where they help the optimization. The proposal is to avoid maintaining two unrelated systems that calculate the same code relationships.

## End-to-end scenario

The following example shows the intended workflow. The values and outcome are illustrative, not measured facts about a particular repository.

1. **Choose a target and objective.** A developer selects a slow function and asks to reduce its execution time while preserving its behavior.
2. **Gather relevant history.** Heidrun Code can request previous attempts, known constraints, and the function's dependencies from Heidrun Data. This step is useful but does not replace measurement.
3. **Establish a baseline.** Code Spine runs a representative workload and records the initial performance, runtime configuration, machine, input, and measurement method.
4. **Find the bottleneck.** Code Spine profiles execution and identifies the functions or operations that account for the measured cost. It distinguishes time spent directly in a function from time spent in its called functions where the profiler supports that view.
5. **Form a testable hypothesis.** The agent proposes a targeted change based on the source code, dependency information, profile, and relevant historical evidence. For example, it may suspect that repeated database lookups dominate the measured time.
6. **Apply a controlled change.** The change is made in an environment where it can be reviewed and reverted. The experiment records which files changed and which hypothesis the change tests.
7. **Check behavior.** Code Spine runs relevant functional and regression tests. A change that breaks required behavior is rejected even if it is faster.
8. **Measure again.** If validation succeeds, Code Spine repeats the workload under comparable conditions and compares the new measurements with the baseline.
9. **Decide and record.** The change is kept only if it meets the stated objective and constraints. Otherwise, it is rejected or revised. The decision, test evidence, measurement conditions, and before-and-after results are recorded.
10. **Enrich project history.** Code Spine sends the experiment record to Heidrun Data. A future developer can ask what was attempted and find the hypothesis, exact change, measurements, test outcomes, and reason for the decision.

## What an experiment record should contain

A useful record should let another person understand and assess the experiment later. The proposed fields include:

- A unique experiment identifier.
- The repository and target function or module.
- The baseline commit and, if applicable, the final commit.
- The machine, runtime version, configuration, input, and measurement method.
- The initial measurement and the bottleneck identified.
- The optimization hypothesis.
- The exact changes made.
- Test names and results.
- The measurements after the change and a comparable before-and-after result.
- The decision to accept, reject, or continue the attempt, with its reason.
- Links to profiles, logs, conversations, code changes, and other supporting evidence.

A short example record could say that an index was proposed to reduce a costly database lookup, tests passed, and the measured response time changed from 500 milliseconds to 50 milliseconds. These numbers illustrate a format only; they are not a result reported for a real repository.

## Why retain rejected experiments?

A rejected change can still contain valuable knowledge. For example, a cache may improve a benchmark but return stale data under a relevant workflow. The record should preserve the hypothesis, change, measurements, failing test or observed issue, and rejection reason.

A later developer can then discover the earlier attempt and judge whether the same constraint still applies. A past failure is useful evidence, but it does not prove that a similar idea will always fail: the code, workload, or requirements may have changed.

## Measurement and validation principles

Performance comparisons are meaningful only when the conditions are sufficiently comparable. The experiment should record its environment and workload, repeat measurements when needed, and report uncertainty or variability rather than presenting a noisy result as a precise gain.

The workflow should also:

- Set the behavior and performance objective before the attempt.
- Use representative inputs and workloads.
- Run relevant functional and regression tests.
- Keep the original version available so an unsuccessful change can be reverted.
- Separate measured results from explanations or predictions.
- Record test failures and performance regressions, not only successful outcomes.
- Avoid claiming a general speed improvement from one workload or one machine.

The issue records previous experiments with reported speedups as personal observations, not as a general performance promise. Any customer-facing performance claim needs a repeatable benchmark and clear conditions.

## How this creates a learning loop

1. Code Spine measures and tests a change near the developer's environment.
2. Heidrun Data stores the experiment and connects it with code history, issues, pull requests, and conversations.
3. A later developer asks about the same function or module.
4. Heidrun Data returns the earlier attempt and its evidence, including failures.
5. Code Spine can use that history to form a more informed next hypothesis.

This is accumulation of structured project knowledge. It does not require training a new language model. The value comes from preserving verifiable evidence and making it retrievable when a similar task arises.

## Product and team value

The active workflow makes an optimization proposal testable. A developer can inspect the change, verify that required tests pass, and compare performance measurements under recorded conditions. This provides a concrete account of what changed and what was observed.

When experiment records are shared through Heidrun Data Team, the knowledge can benefit the team rather than remaining only with the person who ran the experiment. Access, organizational isolation, and privacy rules still apply to the conversations, source records, profiles, and logs that may contain sensitive information.

## Limits and open questions

- Code Spine needs an environment capable of running the target software and its relevant tests.
- Benchmarks may be unrepresentative, noisy, or affected by hardware and workload differences.
- Passing tests supports behavior preservation but cannot prove that every behavior is unchanged.
- Automated changes need review, version control, and a reliable way to reject or revert them.
- Some bottlenecks depend on external services or production data that are not available in a safe local environment.
- The experiment format, evidence retention, permissions, and transfer contract between Code Spine and Heidrun Data remain to be defined.
- The number of iterations and stopping conditions need to respect the developer's time, compute, and inference budget.

## Summary

Heidrun Data connects historical project records and static code analysis results, then keeps the evidence available for later questions. Heidrun Code provides the developer-facing entry point. Code Spine runs the active loop that profiles, changes, tests, and measures software. Code Spine can then publish the experiment record to Heidrun Data so that successful and unsuccessful attempts both inform future work.
