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

Proposed journey. A developer has already imported GitHub issues and pull requests for the repository and wants to find the relevant records.

### 3.2. Actions and expected outcome

1. Search the repository’s imported open GitHub issues for “slow startup”.
2. See the matching issue titles and links.

### 3.3. Failure and recovery

The outcome is blocked if the required records cannot be read. Symbiospec leaves failure feedback and recovery open.

## 4. Proposed changes

None.

## 5. Specification review

Reviewed on 17 November 2026 against the [repository revision](https://github.com/heidrun-org/heidrun_data/commit/d2593a27179571bef68296fca96a9f8d1f343cfd), using the published Heidrun Data Symbiospec in that checkout. The starting condition, action and result serve one developer goal. The [Source glossary](../glossary/data_layer.md#2-source) supports the starting data. Symbiospec leaves the search entry point, matching and display rules, empty results, and failure recovery open. Other journeys and runtime behaviour were outside this review.

## 6. Software verification

Software not exercised. Any saved report linked above is historical evidence from the testbed.
