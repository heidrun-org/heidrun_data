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

## 2. Human approval

Proposal. The developer asked to start the user scenario workflow. Approval of this journey is pending.

## 3. Journey

### 3.1. Goal and starting conditions

Proposed journey. A developer previously imported user activity records for the workspace, and at least one new user activity record has been collected.

### 3.2. Actions and expected outcome

1. Run update for the `user_activity` source. See [Initialize and update](../behaviour/synchronization.md#1-initialize-and-update).
2. Confirm that the changed records are present and that each record appears once. Repeating the update with the same source data adds no duplicate records.

### 3.3. Failure and recovery

The outcome is blocked if the required records cannot be read. Symbiospec leaves failure feedback and recovery open.

## 4. Proposed changes

None.

## 5. Specification review

Reviewed on 17 November 2026 against the [repository revision](https://github.com/heidrun-org/heidrun_data/commit/d2593a27179571bef68296fca96a9f8d1f343cfd), using the published Heidrun Data Symbiospec in that checkout. The starting condition, action and result serve one developer goal. The [Source glossary](../glossary/data_layer.md#2-source) identifies the records and [Initialize and update](../behaviour/synchronization.md#1-initialize-and-update) describes the intended import. The specification leaves the command entry point, how to confirm the import, and failure recovery open. The imported descriptions have unresolved historical approval. Other journeys and runtime behaviour were outside this review.

## 6. Software verification

Software not exercised. Any saved report linked above is historical evidence from the testbed.
