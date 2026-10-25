# bug_triage_workflow

The skill `bug_triage_workflow` helps a developer choose the next bug to fix, to make the software more stable. This way of working is the Bug Triage Workflow. Here, triage means to review the bugs and to decide which bugs need attention first.

## Purpose

An issue list grows over time. The issue list mixes bugs, feature requests, questions, notes, tracking issues, duplicates, and work that is already done. A developer who wants more stable software must find, in this issue list, the bug that most needs a fix now.

The Bug Triage Workflow makes the coding agent read every open issue, assess each bug from evidence, and recommend the next bug to fix, with the reason. The goal is not a smaller number of issues. The goal is an issue list that gives a useful picture of the problems that remain in the software.

## The four steps

1. Collect: the coding agent collects every open issue of the scope that the developer names, on GitHub or on GitLab, on every page of results. The coding agent reads each issue and its comments, and reads the code and the history when a claim needs a check.
2. Assess: for each bug, the coding agent assesses the evidence about these points:
   - Impact: data loss, crashes, incorrect results, blocked work, or other effects on normal use.
   - Frequency and reach: how often the bug occurs, and which users or workflows the bug affects.
   - Regressions: whether behavior that worked before is now broken.
   - Readiness: whether the report gives the steps to reproduce, the expected behavior, and the observed behavior.
   - Dependencies: whether another bug or missing information must come first.
3. Report: the coding agent writes the report in the chat. The report starts with the recommended next bug and its reason, then gives the other bugs in the recommended order. Each issue gets one recommendation:
   - Handle first
   - Keep
   - Clarify
   - Close
4. Decide: the coding agent waits for the decisions of the developer.

## The review is read-only

During the review, the coding agent changes no file, no label, and no issue, writes no comment, does not start the application, and does not try to reproduce a bug. A recommendation to close an issue is not a permission to close the issue. The coding agent closes an issue only when the developer asks for the close and names the issue number.

## When the coding agent uses the skill

- The developer asks which bug to fix next.
- The developer asks how to prioritize the bugs.
- The developer asks to review or to triage the issue list.

## Configuration

The skill `bug_triage_workflow` needs no configuration. The skill does not assume that labels, configuration files, or another workflow exist in the repository.

## Install

```bash
npx skills add jeromeetienne/coding_agent_plugin --skill bug_triage_workflow
```

## Files

- [SKILL.md](SKILL.md): the instructions for the coding agent.
