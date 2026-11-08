# repo_folders_constraints

The skill `repo_folders_constraints` reads, obeys, and proposes changes to the Repo Folders Constraints of a repository. The Repo Folders Constraints are the rules of the folders and of the packages of the repository, in one rules file that the human owns.

## Purpose

A coding agent creates folders, moves files, and adds imports between packages fast. Without written rules, the coding agent cannot tell what a folder does, what a folder never holds, or which package may import which other package. The structure of the repository then decays in silence.

The skill `repo_folders_constraints` keeps these rules in one rules file, for a review by the human. The coding agent obeys the rules file, and never changes the rules file without the approval of the human.

## The form

- The rules file: one markdown file, with one table for the packages and one table for the other folders.
- The columns: Folder, Does, Never does, May import (only for the packages), Language and technologies, and Workflow.
- The value "not decided yet": the human has not decided the rule yet.
- The change of a rule: the coding agent shows the rule as it is now and the proposed rule, and the human chooses Approve, Cancel, or Refine.

## When the coding agent uses the skill

- Before the coding agent creates, moves, renames, or deletes a folder or a package.
- Before the coding agent adds a file in a folder.
- Before the coding agent adds an import or a dependency between packages.
- When a folder or a package has no rule in the rules file.

## Configuration

The skill `repo_folders_constraints` names no detail of one repository. The caller always gives the path of the rules file:

- The Rules of the Repo gives the path of the rules file, from its own configuration folder.
- Without The Rules of the Repo, the section "Repo Folders Constraints" of the file `AGENTS.md` of the receiving project gives the path of the rules file.

The section "The template" of [SKILL.md](SKILL.md) gives the text to copy. When no caller gives the path, the coding agent does not change a folder or a package: the coding agent warns the developer, shows the template, and asks for the path of the rules file.

## Related skill

The skill [context_md_system](../context_md_system/README.md) keeps the `CONTEXT.md` files, the notes of the coding agent. The coding agent changes a `CONTEXT.md` file without the approval of the human. When the rules file and a `CONTEXT.md` file disagree, the rules file wins.

## Install

```bash
npx skills add jeromeetienne/coding_agent_plugin --skill repo_folders_constraints
```

## Files

- [SKILL.md](SKILL.md): the instructions for the coding agent, with the form of the rules file and the template of the section of `AGENTS.md`.
- An example of the rules file: [config.md](https://github.com/heidrun-org/heidrun_notebook/blob/main/.agents/rules_of_the_repo/config/repo_folders_constraints/config.md) of Heidrun Notebook.
