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

Proposed journey. A developer has a repository, a local date, and imported coding agent usage data for that day.

### 3.2. Actions and expected outcome

1. Ask for token usage and estimated cost grouped into three-hour periods.
2. See the costs per period and identify the period with the highest estimated cost.

### 3.3. Failure and recovery

The outcome is blocked if the required records cannot be read. Symbiospec leaves failure feedback and recovery open.

## 4. Proposed changes

None.

## 5. Specification review

Reviewed on 17 November 2026 against the [repository revision](https://github.com/heidrun-org/heidrun_data/commit/d2593a27179571bef68296fca96a9f8d1f343cfd), using the published Heidrun Data Symbiospec in that checkout. The starting condition, action and result serve one developer goal. The [Source glossary](../glossary/data_layer.md#2-source) describes imported records. Symbiospec leaves the report request and presentation, the expected result when records are incomplete, and failure recovery open. Other journeys and runtime behaviour were outside this review.

## 6. Software verification

Software not exercised. Any saved report linked above is historical evidence from the testbed.
