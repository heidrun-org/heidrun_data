# Compare activity across repositories over a year

- Created: 17 November 2026
- Last updated: 17 November 2026
- Status: Proposal
- Related framing: [User scenarios](README.md)
- Related rules: [Symbiospec](../../../.agents/skills/symbio_spec/SKILL.md)

## 0. Introduction

### 0.1. Purpose

A developer wants to compare activity across repositories over a year.

## 1. Source

Mixed source. The developer selected this workflow for the batch after reviewing the testbed outputs. The [saved testbed report](../../../testbed_folder/outputs/workspace_heidrun_code/experiment_daily_activity_metrics/index.html) supplies the worked example. The full range of possible inputs was outside the review.

## 2. Human approval

Proposal. The developer asked to start the user scenario workflow. Approval of this journey is pending.

## 3. Journey

### 3.1. Goal and starting conditions

Proposed journey. A developer wants to compare daily activity across Heidrun Code, Heidrun Notebook, and Heidrun Data over the same one-year period. The developer has imported records for the three repositories and knows the period and time zone.

### 3.2. Actions and expected outcome

1. Ask the coding agent for activity calendars for the three repositories, the same date range, and the same time zone.
2. Open the returned calendars and choose a measure, such as commits. Compare that measure on the same day across repositories and inspect each repository’s daily value.

### 3.3. Failure and recovery

The calendars distinguish a day with zero recorded activity from a day with unavailable data. If a measure has partial data, the calendars identify that limitation. Recovery when the calendars cannot be generated is open.

## 4. Proposed changes

None.

## 5. Specification review

Reviewed on 17 November 2026 against the [reviewed repository revision](https://github.com/heidrun-org/heidrun_data/commit/b64e1ad2fa91b19b6bdef34c3d949ac57d505dbd). The stated starting condition, actions and result serve one developer goal. [Source glossary](../glossary/data_layer.md#2-source) describes the source records. Symbiospec leaves calendar access, comparable date ranges and measures, and the display of missing and partial data open. The saved report illustrates those distinctions. The review covered this journey and its specification links. Runtime behaviour was outside the review.

## 6. Software verification

Software not exercised. Any saved report linked above is historical evidence from the testbed.
