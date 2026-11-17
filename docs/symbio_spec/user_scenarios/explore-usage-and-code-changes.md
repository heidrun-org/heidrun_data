# Explore how coding agent usage and code changes vary together

- Created: 17 November 2026
- Last updated: 17 November 2026
- Status: Proposal
- Related framing: [User scenarios](README.md)
- Related rules: [Symbiospec](../../../.agents/skills/symbio_spec/SKILL.md)

## 0. Introduction

### 0.1. Purpose

A developer wants to explore how coding agent usage and code changes vary together.

## 1. Source

Mixed source. The developer selected this workflow for the batch after reviewing the testbed outputs. The [saved testbed report](../../../testbed_folder/outputs/workspace_heidrun_code/experiment_3d_activity_relationships/index.html) supplies the worked example. The full range of possible inputs was outside the review.

## 2. Human approval

Proposal. The developer asked to start the user scenario workflow. Approval of this journey is pending.

## 3. Journey

### 3.1. Goal and starting conditions

Proposed journey. A developer wants to explore how daily coding agent usage and code changes vary together across repositories. Daily records for the repositories and period are available to examine.

### 3.2. Actions and expected outcome

1. Ask the coding agent for the interactive daily activity plot for the selected repositories and date range.
2. Open the returned plot, choose the measures to compare, such as tokens and lines changed, and inspect points to see the date, repository, and selected daily values.

### 3.3. Failure and recovery

The plot shows how many days are excluded and why when a selected measure is missing or an estimated cost is incomplete. When the remaining points are too limited to compare, the report makes that limitation visible.

## 4. Proposed changes

None.

## 5. Specification review

Reviewed on 17 November 2026 against the [reviewed repository revision](https://github.com/heidrun-org/heidrun_data/commit/b64e1ad2fa91b19b6bdef34c3d949ac57d505dbd). The stated starting condition, actions and result serve one developer goal. [Source glossary](../glossary/data_layer.md#2-source) describes the source records. Symbiospec leaves report access, how measures are compared, and the treatment of missing records open. The saved plot shows how excluded days can be explained. The review covered this journey and its specification links. Runtime behaviour was outside the review.

## 6. Software verification

Software not exercised. Any saved report linked above is historical evidence from the testbed.
