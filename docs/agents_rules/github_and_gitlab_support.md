# Rule: every support for GitHub is also a support for GitLab

- Created: 25 October 2026
- Last updated: 25 October 2026
- Status: Maintained rules for agents and tools
- Related framing: [Project instructions](../../AGENTS.md)
- Related rules: [Glossary of heidrun_data](glossary/index.md)
- Related issue: [issue 10](https://github.com/heidrun-org/heidrun_data/issues/10)

This file gives the rule for every coding agent that writes a `gh` command or adds support for GitHub. A Git repository is on one of two Git hosting services: GitHub or GitLab. `gh` is the command line tool of GitHub. `glab` is the command line tool of GitLab. The repository heidrun_data is on GitHub, but its skills are copied to repositories on GitLab.

## The rule

- When a document or a skill shows a `gh` command, it also shows the matching `glab` command, next to the `gh` command.
- When a `gh` command or option has no matching `glab` command or option, say it in the document, and create a separate issue for the missing support.
- When a change adds support for GitHub in the code, the same change adds the same support for GitLab, or a separate issue for the GitLab support exists. Write the number of the separate issue in the description of the pull request.
- The data layer package `data_layer_code_hosting` reads GitHub only. The support for GitLab in this package is a separate issue.
- Create each separate issue on GitHub, with the `gh` command.

## The words

- Write "pull request" for GitHub, and "merge request" for GitLab.
- When a text is about both hosting services, write "pull request (GitHub) or merge request (GitLab)".
- Write "issue" for both hosting services.

## The matching commands

Each row gives the `gh` command and the matching `glab` command. GitLab marks the `glab` option `--attach` as experimental: GitLab can change or remove the option without notice. Run `glab <command> --help` to check an option before you use it.

| Action | GitHub | GitLab |
| --- | --- | --- |
| Read an issue | `gh issue view <number> --comments` | `glab issue view <number> --comments` |
| Create an issue | `gh issue create --title "<title>" --body-file <file>` | `glab issue create --title "<title>" --description "<body>"` |
| Attach a file when you create an issue | `gh issue create --title "<title>" --body "<body>" --attach './screenshot.png#Alt text'` | `glab issue create --title "<title>" --description "<body>" --attach './screenshot.png'` |
| Attach a file to an existing issue | `gh issue edit <number> --attach './screenshot.png#Alt text'` | `glab issue update <number> --attach './screenshot.png'` |
| Comment on an issue | `gh issue comment <number> --body-file <file>` | `glab issue note <number> --message "<comment>"` |
| Close an issue | `gh issue close <number>` | `glab issue close <number>` |
| Push the branch before a pull request or a merge request | `git push -u origin <branch>` | `git push -u origin <branch>` |
| Create a pull request or a merge request | `gh pr create --base <target> --head <branch> --title "<title>" --body-file <file>` | `glab mr create --target-branch <target> --source-branch <branch> --title "<title>" --description "<body>"` |
| Merge a pull request or a merge request | `gh pr merge <number> --merge` | `glab mr merge <number>` |

The option `--attach` of `glab` takes a file path only. It has no alternative text after `#`.
