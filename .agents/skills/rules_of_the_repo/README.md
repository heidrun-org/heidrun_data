# rules_of_the_repo

The skill `rules_of_the_repo` is The Rules of the Repo: the one entry point for the rules of a repository. The skill holds no rule itself. The skill knows which rule skills apply to a change, and where the configuration file of each rule skill is.

## Purpose

A repository uses many rule skills: a coding style, the rules of the folders, the documentation folder, the product specification. Without one entry point, the coding agent forgets a rule skill, or reads a rule skill without its configuration.

Before each change, The Rules of the Repo reads the rules list, finds the rule skills that apply to the change, and gives each rule skill the path of its configuration file. Each rule skill checks the change. A missing configuration file stops the change.

## The form

- The rules list: one markdown file, with one row for each rule skill. The columns are Skill, When it applies, Rule type, and Configuration.
- The rule types:
  - Static rule: the coding agent obeys the rule, and never changes the rule.
  - Living rule with human approval: the rule changes only after the human chooses Approve, Cancel, or Refine.
  - Living rule without human approval: the notes of the coding agent, which the coding agent changes alone.
- The configuration files: each rule skill has its own configuration file, in its own folder, never inside the folder of the rule skill.

The rule skills stay independent: each rule skill works the same way without The Rules of the Repo, with a section of the file `AGENTS.md`.

## When the coding agent uses the skill

- Before every change of the repository.
- When the developer asks to set up The Rules of the Repo in a new or an existing repository.

## Configuration

The skill `rules_of_the_repo` names no detail of one repository. The receiving project gives the path of the rules list in the section "The Rules of the Repo" of its file `AGENTS.md`. The section "The template" of [SKILL.md](SKILL.md) gives the text to copy, and the template of the rules list. When the path or the rules list is missing, the coding agent does not change the repository: the coding agent warns the developer, shows the templates, and offers to set up The Rules of the Repo.

## Related skills

The Rules of the Repo calls these rule skills, each with its configuration file:

- [repo_folders_constraints](../repo_folders_constraints/README.md)
- [docs_folder_system](../docs_folder_system/README.md)
- [docs_folder_agents_rules_system](../docs_folder_agents_rules_system/README.md)
- [symbio_spec](../symbio_spec/README.md)
- [context_md_system](../context_md_system/README.md)
- [jerome-typescript-javascript-style](../jerome-typescript-javascript-style/README.md)

## Install

```bash
npx skills add jeromeetienne/coding_agent_plugin --skill rules_of_the_repo
```

## Files

- [SKILL.md](SKILL.md): the instructions for the coding agent, with the rule types and the templates.
- Examples from Heidrun Notebook:
  - The rules list: [rules_list.md](https://github.com/heidrun-org/heidrun_notebook/blob/main/.agents/rules_of_the_repo/rules_list.md)
  - A configuration file: [config.md](https://github.com/heidrun-org/heidrun_notebook/blob/main/.agents/rules_of_the_repo/config/docs_folder_agents_rules_system/config.md)
  - The test of the rules list: [check_rules_of_the_repo.ts](https://github.com/heidrun-org/heidrun_notebook/blob/main/scripts/check_rules_of_the_repo.ts)
