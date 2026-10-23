# testbed_folder

The folder `testbed_folder/` is a place to try the skill `heidrun-data`. Start the command line of your coding agent in the folder `testbed_folder/`, so that the coding agent reads the skill `heidrun-data`, and then ask the coding agent questions that use the skill `heidrun-data`.

## How to start

```sh
cd testbed_folder
claude
```

Use `claude` for Claude Code. Any other coding agent that reads `AGENTS.md` and `.agents/skills/` also works.

## What the folder holds

- `AGENTS.md`: the instructions for any coding agent.
- `.agents/skills/heidrun-data`: a symbolic link to `packages/heidrun_data/skills/heidrun-data`.
- `CLAUDE.md` and `.claude/skills`: the layer for Claude Code on top of `AGENTS.md` and `.agents/skills/`.
