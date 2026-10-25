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
- Worktree creation command: `git fetch && git worktree add ../heidrun_data_<branch name> -b <branch name> origin/main`
- Worktree folder: `../heidrun_data_<branch name>`, next to the main checkout
- Launch command: `cd <worktree folder> && pnpm install && pnpm build && ./target/debug/heidrun_data --help` (the build of the worktree is in its own folder `target`, so it does not change the build of the main checkout)
- Issue tracker commands: `gh issue view <number> --comments`, `gh issue comment <number> --body-file <file>`, `gh issue create --title <title> --body-file <file>`, `gh pr create --base main --head <branch> --title <title> --body-file <file>`, `gh pr merge <number> --merge`, `gh issue close <number>`
- Chat rename: not available; the developer renames the chat with `/rename`

## Text of an issue

Every issue, every comment of an issue, and every description of a pull request follows the skill [issue_creation](.agents/skills/issue_creation/SKILL.md). The repository is on GitHub, so use the command `gh`.

## Folder context files

Every source folder has a file `CONTEXT.md`. Follow the skill [context_md_system](.agents/skills/context_md_system/SKILL.md) before you edit or add a file in a folder.

## Docs folder

Every file and every folder in the folder `docs` follows the skill [docs_folder_system](.agents/skills/docs_folder_system/SKILL.md). Read the skill before you add, change, rename, move, or delete a file or a folder in the folder `docs`.
The skill names no detail of this repository: it reads the values of this repository in the section "Docs folder system values" below.

### Docs folder system values

- Documentation folder: `docs`
- Files with no metadata header: none
