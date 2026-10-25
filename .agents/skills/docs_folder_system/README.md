# docs_folder_system

The skill `docs_folder_system` gives one form to every file and every folder of the documentation folder of a repository, the folder that the coding agents write and read. This form is the Docs folder system.

## Purpose

When coding agents write and read the documentation, the documentation folder grows fast. Without one form, a coding agent cannot tell when a file was written, whether the file is still maintained, which rules apply to the file, or which file to read for a task. The coding agent then reads too many files, or the wrong files.

The Docs folder system gives each file and each folder the same form, so that a coding agent can start at the top `index.md` file and go down, folder by folder, to the file that the coding agent needs, by reading only one sentence for each file.

## The form

- The metadata header: each file has, after its title, these lines:
  - `Created`
  - `Last updated`
  - `Status`
  - `Related framing`
  - `Related rules`, only when a rule file applies
  - `Related issue`, only when an issue exists
- The two files of each folder: each folder has a `README.md` file for people, and an `index.md` file for coding agents and tools. The `index.md` file has one bullet for each file and each subfolder: a relative link, a colon, and one sentence that says what the file or the subfolder holds.
- The update of `index.md`: when the coding agent adds, renames, moves, or deletes a file or a folder, the coding agent updates the `index.md` file of its folder in the same change.

## When the coding agent uses the skill

- Before the coding agent adds, changes, renames, moves, or deletes a file or a folder in the documentation folder.

## Configuration

The skill `docs_folder_system` names no detail of one repository. The receiving project writes its values in the section "Docs folder system values" of its file `AGENTS.md`:

- Documentation folder
- Files with no metadata header

The section "The template" of [SKILL.md](SKILL.md) gives the text to copy. When a value is missing, the coding agent does not change the documentation folder: the coding agent warns the developer, shows the template, and offers to propose the values.

## Related skill

The skill [docs_folder_agents_rules_system](../docs_folder_agents_rules_system/README.md) needs the skill `docs_folder_system`. The skill `docs_folder_system` gives the form of the files. The skill `docs_folder_agents_rules_system` gives what to do with the agent rules and the glossary.

## Install

```bash
npx skills add jeromeetienne/coding_agent_plugin --skill docs_folder_system
```

## Files

- [SKILL.md](SKILL.md): the instructions for the coding agent, with an example of a metadata header.
