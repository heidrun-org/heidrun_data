# Coding agent instructions

This repository holds the data layer packages of Heidrun Organization, as a pnpm workspace. The [README](README.md) gives the commands to install, build, and test. The skills are in the folder `.agents/skills/`.

## Layer for Claude Code

- `CLAUDE.md` imports this file.
- `.claude/skills/` holds one symbolic link for each skill in `.agents/skills/`.

## Issue Fix Workflow

Every issue fix in this repository follows the skill [issue_fix_workflow](.agents/skills/issue_fix_workflow/SKILL.md). Read the skill before you start an issue fix, each time that the developer asks to fix an issue.
The skill names no detail of this repository: it reads the values of this repository in the section "Issue Fix Workflow values" below.

### Issue Fix Workflow values

- Target branch: `main`
- Worktree creation command: `git fetch && git worktree add .agents/worktrees/<branch name> -b <branch name> origin/main`, run at the root of the main checkout.
- Worktree folder: `.agents/worktrees/<branch name>`, inside the main checkout. Git ignores the folder `.agents/worktrees`.
- Launch command: `cd .agents/worktrees/<branch name> && pnpm install && pnpm build && ./target/debug/heidrun_data --help` (the build of the worktree is in its own folder `target`, so it does not change the build of the main checkout)
- Issue tracker commands: this repository is on GitHub, so use the `gh` command. The matching `glab` commands for GitLab are in [github_and_gitlab_support.md](docs/agents_rules/github_and_gitlab_support.md).
  - Read an issue: `gh issue view <number> --comments`
  - Comment on an issue: `gh issue comment <number> --body-file <file>`
  - Create an issue: `gh issue create --title <title> --body-file <file>`
  - Create a pull request: first `git push -u origin <branch name>`, because the worktree creation command makes the new branch track `origin/main`, so a plain `git push` fails. Then `gh pr create --base main --head <branch name> --title <title> --body-file <file>`
  - Merge a pull request: `gh pr merge <number> --merge`
  - Close an issue: `gh issue close <number>`
- Chat rename: not available; the developer renames the chat with `/rename`

## Text of an issue

Every issue, every comment of an issue, and every description of a pull request follows the skill [issue_creation](.agents/skills/issue_creation/SKILL.md). The repository is on GitHub, so use the command `gh`. The skill links to the rule [github_and_gitlab_support.md](docs/agents_rules/github_and_gitlab_support.md).

## Folder context files

Every source folder has a file `CONTEXT.md`. Follow the skill [context_md_system](.agents/skills/context_md_system/SKILL.md) before you edit or add a file in a folder.

## Docs folder

Every file and every folder in the folder `docs` follows the skill [docs_folder_system](.agents/skills/docs_folder_system/SKILL.md). Read the skill before you add, change, rename, move, or delete a file or a folder in the folder `docs`.
The skill names no detail of this repository: it reads the values of this repository in the section "Docs folder system values" below.

### Docs folder system values

- Documentation folder: `docs`
- Files with no metadata header: none

## Agent rules

The folder `docs/agents_rules` holds all the rules that every coding agent obeys. Before you change the code, read the glossary and the rule files that match the part that you change, as the skill [docs_folder_agents_rules_system](.agents/skills/docs_folder_agents_rules_system/SKILL.md) says. This skill needs the skill [docs_folder_system](.agents/skills/docs_folder_system/SKILL.md).
The skill names no detail of this repository: it reads the values of this repository in the section "Docs folder agents rules system values" below.

### Docs folder agents rules system values

- Agent rules folder: `docs/agents_rules`
- Glossary folder: `docs/agents_rules/glossary`
- Maximum size of a file: 10000 bytes.
- Size test command: `pnpm --filter agents_rules_checker test`

## Bug Triage Workflow

The Bug Triage Workflow reviews the open bug issues and recommends the next bug to fix. It is read-only: it changes no issue. A triage starts only when the developer asks for it in the chat. Read the skill [bug_triage_workflow](.agents/skills/bug_triage_workflow/SKILL.md) before you start a triage.

## Git Cleanup Adviser

The Git Cleanup Adviser reviews the Git branches and the worktrees, and reports which ones appear safe to remove, with evidence. It gives advice only, and removes no branch and no worktree. The destination branch is `main`. Read the skill [git_cleanup_adviser](.agents/skills/git_cleanup_adviser/SKILL.md) when the developer asks which branches or worktrees can be removed.
