# Directory Context: `/packages/dev_tools`

## Purpose
The packages that are only tools for the developers of the repository heidrun_data. None of them is a data layer package, and no data layer package needs any of them to run.

## Key Exports & Entry Points
- `agents_rules_checker/`: a package with the test of the maximum size of a file of the agent rules in the folder `docs/agents_rules`. Command: `pnpm --filter agents_rules_checker test`. See its own CONTEXT.md.

## Rules
- A package that is only a tool for the developers of the repository heidrun_data goes in this folder.
- No package of the folder `packages` imports a package from this folder.

## Background
- The folder was created by [issue #10](https://github.com/heidrun-org/heidrun_data/issues/10).
