# Reconstruct a module’s history

- Created: 17 November 2026
- Last updated: 17 November 2026
- Status: Proposal
- Related framing: [User scenarios](README.md)
- Related rules: [Symbiospec](../../../.agents/skills/symbio_spec/SKILL.md)

## 0. Introduction

### 0.1. Purpose

A developer wants to reconstruct a module’s history.

## 1. Source

Mixed source. The developer selected this workflow for the batch after reviewing the testbed outputs. The [saved testbed report](../../../testbed_folder/outputs/workspace_heidrun_data_example_database/experiment_heidrun_notebook_ctrl_module_history/index.html) supplies the worked example. The full range of possible inputs was outside the review.

## 2. Human approval

Proposal. The developer asked to start the user scenario workflow. Approval of this journey is pending.

## 3. Journey

### 3.1. Goal and starting conditions

Proposed journey. A developer wants to understand how the package `heidrun_notebook_ctrl` in Heidrun Notebook evolved. The developer can identify the package and has access to the imported history for the repository.

### 3.2. Actions and expected outcome

1. Ask the coding agent for the package history and give the repository and package name.
2. Open the interactive report returned by the coding agent. Use the timeline to follow the package’s origin, major decisions, and attempts. Open the references behind key findings to inspect the commits, issues, pull requests, or chat sessions that support them.

### 3.3. Failure and recovery

When a source or part of the timeline is unavailable, the report identifies the missing evidence. It distinguishes recorded facts, interpretations, and open questions. Recovery when the package cannot be located is open.

## 4. Proposed changes

None.

## 5. Specification review

Reviewed on 17 November 2026 against the [reviewed repository revision](https://github.com/heidrun-org/heidrun_data/commit/b64e1ad2fa91b19b6bdef34c3d949ac57d505dbd). The stated starting condition, actions and result serve one developer goal. [Source glossary](../glossary/data_layer.md#2-source) describes the source records. Symbiospec identifies the underlying record types but leaves package matching, how to request and open the report, and how to present findings and missing evidence open. The saved report is the example for this proposal. The review covered this journey and its specification links. Runtime behaviour was outside the review.

## 6. Software verification

Software not exercised. Any saved report linked above is historical evidence from the testbed.
