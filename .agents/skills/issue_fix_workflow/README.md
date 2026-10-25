# issue_fix_workflow

The skill `issue_fix_workflow` gives a coding agent one fixed way to fix an issue of a repository, from the first read of the issue to the merge of the pull request and the close of the issue. This fixed way is the Issue Fix Workflow.

## Purpose

When a developer asks a coding agent to fix an issue, the coding agent can do the steps in many orders. The coding agent can change the main checkout, commit before the developer reads the change, merge before the developer runs the application, or add work that the issue does not describe. Each of these actions makes the change hard to review and hard to trust.

The Issue Fix Workflow makes every issue fix follow the same steps, so that:

- The main checkout never changes during a fix, because all the work is in a temporary worktree.
- The developer reads the uncommitted difference and runs the application before the coding agent commits.
- The coding agent commits, merges, and closes the issue only after the developer says that the result is good.
- The issue, the pull request, and the real change agree, also when the developer asks for more work during the fix.

## The four parts

1. Issue Fix Setup: the coding agent reads the issue and its comments, renames the chat, and creates a temporary worktree with a temporary branch named after the fix and the issue number.
2. Issue Fix Implementation: the coding agent makes the change in the temporary worktree, updates the documents and the tests, and does not commit.
3. Issue Fix Review: the coding agent gives the command that launches the application in the temporary worktree, and says what to look at. After the developer runs the application, the coding agent asks whether the result is good. Each change that the developer asks for goes back to the Issue Fix Implementation.
4. Issue Fix Completion: the coding agent commits with `fixes #<issue number>`, creates and merges the pull request, deletes the temporary branch, removes the temporary worktree, and closes the issue.

## The added requests

An added request is more work that the developer asks for during the fix, and that the issue does not describe. The coding agent says which kind of added request it is:

- A related added request is done in the same temporary worktree. The coding agent adds one comment to the issue for the related added request, and lists the related added request in the description of the pull request.
- An unrelated added request is not done in the temporary worktree. The coding agent asks whether to create a new issue, and the new issue gets its own Issue Fix Workflow.

## When the coding agent uses the skill

- The developer asks to fix an issue, for example "fix the issue 35".
- The developer asks for a change, or for more work, during an issue fix.

## Configuration

The skill `issue_fix_workflow` names no branch, no tool, and no command of one repository. The receiving project writes its values in the section "Issue Fix Workflow values" of its file `AGENTS.md`:

- Target branch
- Worktree creation command
- Worktree folder
- Launch command
- Issue tracker commands
- Chat rename

The section "The template" of [SKILL.md](SKILL.md) gives the text to copy. When a value is missing, the coding agent does not start the fix: the coding agent warns the developer, shows the template, and offers to propose the values.

## Install

```bash
npx skills add jeromeetienne/coding_agent_plugin --skill issue_fix_workflow
```

## Files

- [SKILL.md](SKILL.md): the instructions for the coding agent.
