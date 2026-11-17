# Update imported user activity history

- Created: 17 November 2026
- Last updated: 17 November 2026
- Status: Proposal
- Related framing: [User scenarios](README.md)
- Related rules: [Symbiospec](../../../.agents/skills/symbio_spec/SKILL.md)

## 0. Introduction

### 0.1. Purpose

A developer uses update to bring user activity records into Heidrun Data.

## 1. Source

Mixed source. The developer requested one initialize and one update journey per source in the batch discussion. The source and synchronization behaviour come from the [Source glossary](../glossary/data_layer.md#2-source) and [Initialize and update](../behaviour/synchronization.md#1-initialize-and-update).

The [heidrun_data command reference](../../../packages/apps/heidrun_data/README.md#command-line) documents the command and source selection as implementation context. The [User activity record fields](../../../packages/data_layers/data_layer_user_activity/README.md#the-database) explains how to identify a record.

## 2. Human approval

Proposal. The developer asked to start the user scenario workflow. Approval of this journey is pending.

## 3. Journey

### 3.1. Goal and starting conditions

Proposed journey. The developer previously imported the user activity records file into the target database. A new completed activity period for the same workspace folder is now in the file.

### 3.2. Actions and expected outcome

1. Select the same user activity records file and target database and run `heidrun_data update user_activity` with `--file` and `--database`.
2. See the update summary for the selected source.
3. Query the same database for the workspace folder and the new period’s start time. One record appears with the expected start and end times.
4. Repeat the update with the same source data. The records checked in the previous step still appear once each.

### 3.3. Failure and recovery

If the activity records file is unavailable, the developer cannot confirm the expected record. How Heidrun Data presents an absent file and how the developer recovers are open.

## 4. Proposed changes

None.

## 5. Specification review

Reviewed on 17 November 2026 against the [reviewed repository revision](https://github.com/heidrun-org/heidrun_data/commit/b64e1ad2fa91b19b6bdef34c3d949ac57d505dbd). The stated starting condition, actions and result serve one developer goal. [Source glossary](../glossary/data_layer.md#2-source) identifies the records and [Initialize and update](../behaviour/synchronization.md#1-initialize-and-update) describes the mode and repeat behaviour. Historical approval of those descriptions is unverified. Symbiospec leaves the command entry point, confirmation feedback, and recovery open. The entry point and observable check above are proposed for this journey. The review covered this journey and its specification links. Runtime behaviour was outside the review.

## 6. Software verification

Software not exercised.
