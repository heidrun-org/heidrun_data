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

Proposed journey. A developer has daily coding agent usage and code change records for repositories of interest.

### 3.2. Actions and expected outcome

1. Choose the measures to compare in the interactive daily activity plot.
2. Inspect individual days and repositories to see how the selected measures vary together.

### 3.3. Failure and recovery

The outcome is blocked if the required records cannot be read. Symbiospec leaves failure feedback and recovery open.

## 4. Proposed changes

None.

## 5. Specification review

Reviewed on 17 November 2026 against the [repository revision](https://github.com/heidrun-org/heidrun_data/commit/d2593a27179571bef68296fca96a9f8d1f343cfd), using the published Heidrun Data Symbiospec in that checkout. The starting condition, action and result serve one developer goal. The [Source glossary](../glossary/data_layer.md#2-source) describes imported records. Symbiospec leaves the report request and presentation, the expected result when records are incomplete, and failure recovery open. Other journeys and runtime behaviour were outside this review.

## 6. Software verification

Software not exercised. Any saved report linked above is historical evidence from the testbed.
