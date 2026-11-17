# Review a day’s commits and pull requests

- Created: 17 November 2026
- Last updated: 17 November 2026
- Status: Proposal
- Related framing: [User scenarios](README.md)
- Related rules: [Symbiospec](../../../.agents/skills/symbio_spec/SKILL.md)

## 0. Introduction

### 0.1. Purpose

A developer wants to review a day’s commits and pull requests.

## 1. Source

Mixed source. The developer selected this workflow for the batch after reviewing the testbed outputs. The [saved testbed report](../../../testbed_folder/outputs/workspace_heidrun_data_example_database/experiment_commits_and_pull_requests_every_three_hours/index.html) supplies the worked example. The full range of possible inputs was outside the review.

## 2. Human approval

Proposal. The developer asked to start the user scenario workflow. Approval of this journey is pending.

## 3. Journey

### 3.1. Goal and starting conditions

Proposed journey. A developer wants to review changes in Heidrun Notebook on 23 October 2026 and has imported the repository’s commits and pull requests. The local day is in the Europe/Paris time zone.

### 3.2. Actions and expected outcome

1. Ask the coding agent for a report for the repository, date, and time zone.
2. Open the report and see commit and pull request counts for each three-hour period. The report places commits by commit time and pull requests by opening time. Open a period to inspect its records.

### 3.3. Failure and recovery

The report shows how current the records are for each source and identifies gaps that could make a period incomplete. Recovery when the report cannot be generated is open.

## 4. Proposed changes

None.

## 5. Specification review

Reviewed on 17 November 2026 against the [reviewed repository revision](https://github.com/heidrun-org/heidrun_data/commit/b64e1ad2fa91b19b6bdef34c3d949ac57d505dbd). The stated starting condition, actions and result serve one developer goal. [Source glossary](../glossary/data_layer.md#2-source) describes the source records. Symbiospec identifies commit and pull request records but leaves time zone selection, period boundaries, which events are counted, and access to the report open. The saved report supplies the counting method for this example. The review covered this journey and its specification links. Runtime behaviour was outside the review.

## 6. Software verification

Software not exercised. Any saved report linked above is historical evidence from the testbed.
