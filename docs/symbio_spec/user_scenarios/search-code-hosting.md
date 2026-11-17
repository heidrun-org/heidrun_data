# Find open GitHub issues about slow startup

- Created: 17 November 2026
- Last updated: 17 November 2026
- Status: Proposal
- Related framing: [User scenarios](README.md)
- Related rules: [Symbiospec](../../../.agents/skills/symbio_spec/SKILL.md)

## 0. Introduction

### 0.1. Purpose

Search the repository’s imported open GitHub issues for “slow startup”.

## 1. Source

Mixed source. The developer requested one search per source in the batch discussion and selected the proposed search set. The [Source glossary](../glossary/data_layer.md#2-source) identifies the record type. The [repository query example](../../../README.md#usage-scenario) illustrates querying imported data.

## 2. Human approval

Proposal. The developer asked to start the user scenario workflow. Approval of this journey is pending.

## 3. Journey

### 3.1. Goal and starting conditions

Proposed journey. A developer has imported GitHub issues for a repository and wants to find the open issues about “slow startup”.

### 3.2. Actions and expected outcome

1. Search the imported issue titles and descriptions for “slow startup”, within the selected repository and with the state set to open. Match the text regardless of letter case.
2. See matching issue titles and links, ordered by most recently updated.

### 3.3. Failure and recovery

When the selected records are available and the search finds no matches, say so. When the relevant records are unavailable or the search is incomplete, identify the gap. Recovery is open.

## 4. Proposed changes

None.

## 5. Specification review

Reviewed on 17 November 2026 against the [reviewed repository revision](https://github.com/heidrun-org/heidrun_data/commit/b64e1ad2fa91b19b6bdef34c3d949ac57d505dbd). The stated starting condition, actions and result serve one developer goal. [Source glossary](../glossary/data_layer.md#2-source) supports the record type. Symbiospec does not specify issue search fields, matching, or ordering. The search entry point, feedback on availability, and recovery still need supporting descriptions. The review covered this journey and its specification links. Runtime behaviour was outside the review.

## 6. Software verification

Software not exercised.
