---
name: bug_triage_workflow
description: Organize a repository's open bug issues and recommend the next bug to fix to improve software stability. Use when the developer asks which bug to fix next, how to prioritize bugs, or to review or triage the issue list. Base recommendations on evidence; the review is read-only.
---

# Bug Triage Workflow

Keep the bug issue list organized so the developer can choose the next bug to fix and keep the software stable. Here, triage means reviewing bugs and deciding which need attention first. A smaller issue count is not the goal: the list must give a useful picture of the software’s remaining problems. This workflow is a work in progress, refined through real use.

Start when the developer asks to review the issue list, organize bug issues, or choose the next bug to fix. Use the repository and scope named by the developer. Do not assume that particular labels, configuration files, or another workflow exist.

## 1. Collect

Collect all open issues in the requested scope from the repository’s issue tracker, whether GitHub or GitLab. Retrieve every page of results. Do not treat one page or a command’s default result limit as the complete issue list.

Read each issue and its comments. Read relevant code and history when needed to assess a claim. For a duplicate, read the proposed original issue. For a tracking issue, check the status of the linked work.

If access or another limit prevents a complete review, state which issues were reviewed and what remains. Do not report a partial review as complete.

## 2. Assess

Describe what each issue is about in plain words, such as a bug, feature request, question, note, tracking issue, or duplicate. These descriptions are for the report; they do not require matching labels in the repository.

For each bug, assess what the available evidence says about:

- Impact: data loss, crashes, incorrect results, blocked work, or other effects on normal use.
- Frequency and reach: how often the bug occurs and which users or workflows are affected.
- Regressions: whether previously working behavior has broken.
- Readiness: whether the report gives steps to reproduce, expected and observed behavior, and enough information to investigate.
- Dependencies: whether another bug or missing information must be addressed first.

Keep unknown facts explicit. Compare bugs using the evidence available; do not invent scores, fixed deadlines, or repository labels. A quick or well-understood fix does not automatically outrank a more damaging bug.

Recommend the next bug to fix and explain why that bug takes priority over the other leading candidates. If the evidence is insufficient to choose responsibly, say what must be clarified first instead of making a confident guess.

For the issue list, give each issue an appropriate recommendation:

- **Handle first:** the bug should receive attention next because of its effect on stability or normal use. Explain the reason for the priority.
- **Keep:** the issue describes useful work or information that still applies.
- **Clarify:** the issue needs more information before a decision can be made. Name the missing information.
- **Close:** there is evidence that the work is complete, the issue duplicates another issue, or the issue no longer applies. A decision not to pursue work belongs to the developer.

Age alone is not a reason to close an issue. Missing information is a reason to request clarification, without an automatic deadline for closure.

The review is read-only. Do not change files, labels, or issues, write comments, start the application, or attempt to reproduce bugs during the review.

## 3. Report

Write the report in the chat. Start with the recommended next bug and a short reason. Follow with the remaining bugs in recommended order, stating the reason for each priority. Keep non-bug work identifiable so feature requests do not obscure the bug list.

For each issue, include:

- A link to the issue and a short description.
- The recommendation and the reason.
- The evidence: what was read and what the evidence establishes.
- What remains uncertain or was not checked. Mark bugs as “not tested” because the review does not reproduce them.

After the priorities, identify improvements to the issue list: reports missing information, duplicates, tracking issues that overlap individual bugs, and issues with evidence of completed or outdated work. Recommend those changes without making them. Closing issues supports the usefulness of the list; it does not replace choosing the next bug to fix.

Distinguish evidence that work is complete from an assumption based on an issue’s age, labels, or title.

## 4. Decide

Wait for the developer’s decisions. A recommendation to close an issue is not permission to close the issue.

Close an issue only when the developer explicitly requests closure and names the issue number. Record the reason and, for a duplicate, link to the original issue. Use the issue tracker’s appropriate closure status when available.

Make other issue changes, including labels and comments, only when the developer explicitly requests those changes for named issues. Fixing an issue is separate work from reviewing the issue list.
