# See when coding agent costs were highest

- Created: 17 November 2026
- Last updated: 17 November 2026
- Status: Proposal
- Related framing: [User scenarios](README.md)
- Related rules: [Symbiospec](../../../.agents/skills/symbio_spec/SKILL.md)

## 0. Introduction

### 0.1. Purpose

A developer wants to see when coding agent costs were highest.

## 1. Source

Mixed source. The developer selected this workflow for the batch after reviewing the testbed outputs. The [saved testbed report](../../../testbed_folder/outputs/workspace_heidrun_data_example_database/experiment_ai_cost_every_three_hours/index.html) supplies the worked example. The full range of possible inputs was outside the review.

## 2. Human approval

Proposal. The developer asked to start the user scenario workflow. Approval of this journey is pending.

## 3. Journey

### 3.1. Goal and starting conditions

Proposed journey. A developer wants to know when estimated coding agent costs were highest for Heidrun Notebook on 23 October 2026. The developer has imported coding agent usage and uses the Europe/Paris time zone for that day.

### 3.2. Actions and expected outcome

1. Ask the coding agent for the repository’s token usage and estimated cost in three-hour periods for the chosen date and time zone.
2. Open the report and see the token total and estimated cost for each period. Identify the highest-cost period when the usage coverage and prices support that comparison.

### 3.3. Failure and recovery

Mark a period’s estimate as partial when usage has missing prices. If incomplete records or missing prices could change the result, say that the highest-cost period cannot be determined from the available data.

## 4. Proposed changes

None.

## 5. Specification review

Reviewed on 17 November 2026 against the [reviewed repository revision](https://github.com/heidrun-org/heidrun_data/commit/b64e1ad2fa91b19b6bdef34c3d949ac57d505dbd). The stated starting condition, actions and result serve one developer goal. [Source glossary](../glossary/data_layer.md#2-source) describes the source records. Symbiospec leaves usage time grouping, cost coverage, and report access open. The saved report shows partial estimates, and the treatment of an indeterminate highest cost is a proposed result. The review covered this journey and its specification links. Runtime behaviour was outside the review.

## 6. Software verification

Software not exercised. Any saved report linked above is historical evidence from the testbed.
