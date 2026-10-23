# AGENTS.md

The folder `testbed_folder/` is a place to try the skills of the repository `heidrun_data` with a coding agent. Start the coding agent in the folder `testbed_folder/`.

## Skills

The skills are in `.agents/skills/`. Each skill in `.agents/skills/` is a symbolic link to a skill in `packages/heidrun_data/skills/`, so a change to a skill in `packages/heidrun_data/skills/` is visible here at once.

- `heidrun-data`: answers a question about the history of a repository with the command line `heidrun_data`.

## Layer for Claude Code

- `CLAUDE.md` imports this file.
- `.claude/skills/` is a symbolic link to `.agents/skills/`.
