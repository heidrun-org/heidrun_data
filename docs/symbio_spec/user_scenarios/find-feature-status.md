# Find out where a feature stands

- Created: 17 November 2026
- Last updated: 17 November 2026
- Status: Proposal
- Related framing: [User scenarios](README.md)
- Related rules: [Symbiospec](../../../.agents/skills/symbio_spec/SKILL.md)

## 0. Introduction

### 0.1. Purpose

A developer wants to find out where a feature stands.

## 1. Source

Mixed source. The developer selected this workflow for the batch after reviewing the testbed outputs. The [saved testbed report](../../../testbed_folder/outputs/workspace_heidrun_code/experiment_voice_input_feature_status/index.html) supplies the worked example. The full range of possible inputs was outside the review.

## 2. Human approval

Proposal. The developer asked to start the user scenario workflow. Approval of this journey is pending.

## 3. Journey

### 3.1. Goal and starting conditions

Proposed journey. A developer is returning to Voice input in Heidrun Code and wants to know where to resume. The developer can specify the repository version and has access to the checkout and imported records.

### 3.2. Actions and expected outcome

1. Ask the coding agent for the status of Voice input in the selected repository version.
2. Read the report and identify where to resume work. The report names the version examined and links its conclusions about implementation, testing, and open work to their evidence.

### 3.3. Failure and recovery

The report identifies missing evidence and distinguishes tests checked directly for the report from results reported in earlier chats. When the evidence identifies no next step, the report says so. Recovery when the selected version cannot be examined is open.

## 4. Proposed changes

None.

## 5. Specification review

Reviewed on 17 November 2026 against the [reviewed repository revision](https://github.com/heidrun-org/heidrun_data/commit/b64e1ad2fa91b19b6bdef34c3d949ac57d505dbd). The stated starting condition, actions and result serve one developer goal. [Source glossary](../glossary/data_layer.md#2-source) describes the source records. Symbiospec leaves the report entry point, the version and evidence to inspect, and how to present open work and incomplete test evidence open. The saved report supplies a worked example. The review covered this journey and its specification links. Runtime behaviour was outside the review.

## 6. Software verification

Software not exercised. Any saved report linked above is historical evidence from the testbed.
