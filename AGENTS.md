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
- Issue tracker commands: this repository is on GitHub, so use the `gh` command. The matching `glab` commands for GitLab are in [github_and_gitlab_support.md](docs/symbio_spec/behaviour/github_and_gitlab_support.md).
  - Read an issue: `gh issue view <number> --comments`
  - Comment on an issue: `gh issue comment <number> --body-file <file>`
  - Create an issue: `gh issue create --title <title> --body-file <file>`
  - Create a pull request: first `git push -u origin <branch name>`, because the worktree creation command makes the new branch track `origin/main`, so a plain `git push` fails. Then `gh pr create --base main --head <branch name> --title <title> --body-file <file>`
  - Merge a pull request: `gh pr merge <number> --merge`
  - Close an issue: `gh issue close <number>`
- Chat rename: not available; the developer renames the chat with `/rename`

## Issue Batch Workflow

A batch of related issues (one parent issue with two or more sub-issues) follows the skill [issue_batch_workflow](.agents/skills/issue_batch_workflow/SKILL.md), in place of the Issue Fix Workflow. Read the skill before you start, each time that the developer asks to fix such a batch. The skill uses the section "Issue Fix Workflow values" above.

## Text of an issue

Every issue, every comment of an issue, and every description of a pull request follows the skill [issue_creation](.agents/skills/issue_creation/SKILL.md). The repository is on GitHub, so use the command `gh`. The skill links to the rule [github_and_gitlab_support.md](docs/symbio_spec/behaviour/github_and_gitlab_support.md).

## The Rules of the Repo

Before every change of this repository, follow the skill [rules_of_the_repo](.agents/skills/rules_of_the_repo/SKILL.md): read the rules list, and obey each rule skill that applies to the change, with its configuration.

- Rules list: [.agents/rules_of_the_repo/rules_list.md](.agents/rules_of_the_repo/rules_list.md)

The rules list preserves the folder context, documentation, and coding style rules. Repo Folders Constraints and Symbiospec are active through The Rules of the Repo. Read the [folder constraints](.agents/rules_of_the_repo/repo_folders_constraints/folder_rules.md) before the changes listed by that rule. Read relevant approved specifications in the [Symbiospec index](docs/symbio_spec/index.md) before implementation, and update affected specifications in the same authorized task. Symbiospec replaces the former agent rules folder and contains all imported definitions, rules and reading instructions. Further population requires a developer request; import and initialization do not establish independently verified historical product approval.

### Specifications and glossary

Before changing code, read the [glossary index](docs/symbio_spec/glossary/index.md), the glossary topics that match the change, and the [Symbiospec index](docs/symbio_spec/index.md). Follow indexes to applicable rules and specifications. Use the glossary names in code, documents and conversations.

Update affected rules and glossary entries in the same change. Keep each Symbiospec file within the maximum size below; split larger files by topic and update the index. Run `pnpm --filter agents_rules_checker test` after specification changes. Follow `docs_folder_system` for documentation changes.

- Maximum size of a file: 10000 bytes.

## Git Cleanup Adviser

The Git Cleanup Adviser reviews the Git branches and the worktrees, and reports which ones appear safe to remove, with evidence. It gives advice only, and removes no branch and no worktree. The destination branch is `main`. Read the skill [git_cleanup_adviser](.agents/skills/git_cleanup_adviser/SKILL.md) when the developer asks which branches or worktrees can be removed.
