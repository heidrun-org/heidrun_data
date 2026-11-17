# Import Claude Code and Codex chat history for the first time

- Created: 17 November 2026
- Last updated: 17 November 2026
- Status: Proposal
- Related framing: [User scenarios](README.md)
- Related rules: [Symbiospec](../../../.agents/skills/symbio_spec/SKILL.md)

## 0. Introduction

### 0.1. Purpose

A developer uses initialize to bring Claude Code and Codex chat sessions into Heidrun Data.

## 1. Source

Mixed source. The developer requested one initialize and one update journey per source in the batch discussion. The source and synchronization behaviour come from the [Source glossary](../glossary/data_layer.md#2-source) and [Initialize and update](../behaviour/synchronization.md#1-initialize-and-update).

The [heidrun_data command reference](../../../packages/apps/heidrun_data/README.md#command-line) documents the command and source selection as implementation context.

## 2. Human approval

Proposal. The developer asked to start the user scenario workflow. Approval of this journey is pending.

## 3. Journey

### 3.1. Goal and starting conditions

Proposed journey. A developer wants the available history in Heidrun Data. The selected source contains an earlier Claude Code or Codex session with a known session identifier, and the target database has no prior import for this scope.

### 3.2. Actions and expected outcome

1. Select the local repository folder and target database and run `heidrun_data initialize coding_agents` with `--folder` and `--database`.
2. See the import summary for the selected source, including how many records were written.
3. Query the same database for an earlier Claude Code or Codex session with a known session identifier. The expected record appears.

### 3.3. Failure and recovery

If the required chat history is unavailable, the developer sees which import could not be confirmed. The feedback for incomplete history and recovery are open.

## 4. Proposed changes

None.

## 5. Specification review

Reviewed on 17 November 2026 against the [reviewed repository revision](https://github.com/heidrun-org/heidrun_data/commit/b64e1ad2fa91b19b6bdef34c3d949ac57d505dbd). The stated starting condition, actions and result serve one developer goal. [Source glossary](../glossary/data_layer.md#2-source) identifies the records and [Initialize and update](../behaviour/synchronization.md#1-initialize-and-update) describes the mode and repeat behaviour. Historical approval of those descriptions is unverified. Symbiospec leaves the command entry point, confirmation feedback, and recovery open. The entry point and observable check above are proposed for this journey. The review covered this journey and its specification links. Runtime behaviour was outside the review.

## 6. Software verification

Software not exercised.
