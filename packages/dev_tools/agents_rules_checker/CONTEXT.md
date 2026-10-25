# Directory Context: `/packages/dev_tools/agents_rules_checker`

## Purpose
A TypeScript package that holds the test of the maximum size of a file of the agent rules. The test fails when a file in the folder `docs/agents_rules`, or in one of its subfolders, is larger than the maximum size.

## Key Exports & Entry Points
- `src/index.ts`: the public interface. It exports the class `AgentsRulesSize` and the type `TooLargeFile`.
- `tests/`: the Vitest tests. `tests/temporary_folder.ts` creates temporary folders, and only the tests import it.
- Command to test this folder: `pnpm --filter agents_rules_checker test`

## Rules
- The maximum size of a file of the agent rules is written only in the file `AGENTS.md`, on the line `- Maximum size of a file:` of the section "Docs folder agents rules system values". This package reads the number there and never copies it.
- The test looks at every file in the folder `docs/agents_rules`, in all its subfolders, and not only at the files with the extension `.md`.

## Background
- The package was created by [issue #10](https://github.com/heidrun-org/heidrun_data/issues/10), from the package `agents_rules_checker` of [heidrun_code](https://github.com/heidrun-org/heidrun_code).
