# git_cleanup_review

The skill `git_cleanup_review` identifies worktrees and Git branches whose work is already preserved in the destination branch, usually `main`, and proposes the order for removing those redundant copies. A worktree is a separate working folder connected to the same Git repository.

## Purpose

Find every redundant copy that can be removed while preserving unique work and protected items. The Git Cleanup Review gives advice only. Removing named items needs a later, separate request from the developer.

## What the coding agent does

1. Establishes the destination branch and protects the main checkout, the destination branch, local and remote branches named `main`, `master`, or `dev`, and additional branches protected by repository instructions.
2. Reviews worktrees first. Checks committed work, staged and unstaged changes, new files that are not ignored, and submodules. Treats Git-ignored files as disposable; ignored `.env` files and `content/` directories do not block cleanup. Tracked files remain subject to review even if their names match ignore patterns.
3. Reviews local branches using the worktree decisions. A redundant branch checked out in a redundant worktree is a removal candidate after that worktree is removed.
4. Reviews remote branches using their live state when accessible. Checks inclusion, protection, and pull request context. Missing remote evidence is reported without automatically blocking local recommendations.
5. Reports each worktree and branch with evidence, a last modification date, and a recommendation: **Deleteable**, **Keep**, or **Needs inspection**. The report gives the required order for removing all **Deleteable** items.

A branch being checked out determines removal order; that condition alone does not justify **Keep**. For example, a clean worktree whose work is in `main` and its unprotected branch can both be **Deleteable**, with the worktree listed before the branch.

Branch dates measure the latest commit’s committer date. Worktree dates measure the latest observed file or directory modification time, including ignored files and excluding Git metadata. The report explains missing or incomplete evidence. Dates alone do not prove that removal is safe.

The coding agent does not fetch, prune, switch branches, delete branches, or remove worktrees during the review.

## When the coding agent uses the skill

- The developer asks to audit or to review the branches and the worktrees.
- The developer asks which branches or worktrees can be removed.

## Configuration

The skill `git_cleanup_review` needs no configuration. The coding agent reads the repository instructions to find the destination branch and the branches that must be kept.

## Install

```bash
npx skills add jeromeetienne/coding_agent_plugin --skill git_cleanup_review
```

## Files

- [SKILL.md](SKILL.md): the instructions for the coding agent.
