# git_cleanup_adviser

The skill `git_cleanup_adviser` examines the Git branches and the worktrees of a repository, and advises which branches and worktrees appear safe to remove. This skill is the Git Cleanup Adviser. A worktree is a separate working folder connected to the same Git repository.

## Purpose

After many fixes and experiments, a repository has many branches and worktrees. Some branches hold work that is already in the destination branch. Other branches hold commits that exist nowhere else. Some worktrees hold files that are not committed. When the developer removes the wrong branch or the wrong worktree, the work is lost.

The Git Cleanup Adviser gives the developer the facts before the developer removes anything. For each branch and each worktree, the Git Cleanup Adviser says whether the work is safe, with the evidence, and says what is not sure. The Git Cleanup Adviser gives advice only: the Git Cleanup Adviser never removes a branch or a worktree.

## What the coding agent does

1. Chooses the destination branch, the branch where completed work lands. The coding agent uses the branch that the developer names, or the repository instructions, or asks the developer.
2. Collects the evidence with read-only Git commands.
3. For each worktree, looks for staged changes, unstaged changes, untracked files, and submodule changes.
4. For each branch, checks whether its commits are in the destination branch, also when the work arrived through a squash (several commits combined into one) or another equivalent commit.
5. For each remote branch, separates the branch on the remote server from the local reference, which can be out of date, and checks open pull requests and protected branches when possible.
6. Gives one recommendation for each local branch, each remote branch, and each worktree, in separate rows:
   - Deleteable
   - Keep
   - Needs inspection

The coding agent does not fetch, prune, delete a branch, or remove a worktree during the audit. A removal needs a later, separate request from the developer.

## When the coding agent uses the skill

- The developer asks to audit or to review the branches and the worktrees.
- The developer asks which branches or worktrees can be removed.

## Configuration

The skill `git_cleanup_adviser` needs no configuration. The coding agent reads the repository instructions to find the destination branch and the branches that must be kept.

## Install

```bash
npx skills add jeromeetienne/coding_agent_plugin --skill git_cleanup_adviser
```

## Files

- [SKILL.md](SKILL.md): the instructions for the coding agent.
