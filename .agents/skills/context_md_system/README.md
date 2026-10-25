# context_md_system

The skill `context_md_system` tells a coding agent how to read, create, update, and verify the `CONTEXT.md` files of a repository. This system of files is the CONTEXT.md system. A `CONTEXT.md` file is a short file in a folder that says what the folder is for, what the folder offers to other folders, and what must not be broken.

## Purpose

A coding agent that opens a folder does not know what the folder is for, what other folders can import from the folder, or which rules apply. The coding agent learns these facts by reading many files, or the coding agent guesses. A wrong guess breaks a boundary between modules.

A `CONTEXT.md` file gives these facts in one short file for each folder. The CONTEXT.md system keeps these files accurate, and small enough for the coding agent to read each time that the coding agent changes the folder.

## What the coding agent does

- Read: before the coding agent edits or adds a file, the coding agent reads the nearest `CONTEXT.md` file, then the `CONTEXT.md` file of each parent folder. A rule of a subfolder overrides or narrows a rule of a parent folder.
- Create: when the coding agent creates a folder that holds source code, the coding agent creates its `CONTEXT.md` file from the template.
- Update: when a change adds a core file, changes an exported interface, or changes what a folder is responsible for, the coding agent updates the `CONTEXT.md` file in the same change.
- Keep short: each `CONTEXT.md` file stays under 5500 bytes. A rule is one sentence in the present tense, and the history of the rule stays in the issue tracker, as a link.
- Verify: when a repository has too many `CONTEXT.md` files to read by hand, the coding agent adds a test that checks the files.

## The sections of a CONTEXT.md file

1. Purpose: what the folder is responsible for.
2. Key Exports & Entry Points: what other folders can import, and the command that runs the folder.
3. Rules: what must not be broken, for example which folder must not import which other folder.
4. Background: the reasons and the links behind the rules.

## When the coding agent uses the skill

- Before the coding agent edits or adds a file in a folder.
- When the coding agent creates a folder that holds source code.
- When a change alters the exported interface or the responsibility of a folder.
- When a `CONTEXT.md` file grows over 5500 bytes.
- When the coding agent adds a test that checks the `CONTEXT.md` files.

## Configuration

The skill `context_md_system` needs no configuration.

## Install

```bash
npx skills add jeromeetienne/coding_agent_plugin --skill context_md_system
```

## Files

- [SKILL.md](SKILL.md): the instructions for the coding agent, with the template of a `CONTEXT.md` file.
