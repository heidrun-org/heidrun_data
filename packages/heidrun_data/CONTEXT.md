# Directory Context: `/packages/heidrun_data`

## Purpose
A Rust library and one command line tool, `heidrun_data`, that give a coding agent the data of the four data layers of Heidrun Code in one SQLite file, and the `SKILL.md` that teaches a coding agent to use it. It is not a data layer package: it calls the libraries of the four data layer packages, and stores nothing of its own.

## Key Exports & Entry Points
- `src/lib.rs`: the only public interface of the library. Its `pub use` lines are the list: `Source`, `synchronize`, `lock_database`, `HeidrunDatabase`, `read_catalog`, `data_schema_text`, `read_usage`, the four `read_` functions of the command `read`, `add_limit`, `Format`, `write_rows`, and `default_database_path`.
- `src/main.rs`: the command line, and the executable `heidrun_data`. The module `src/command_line.rs` reads its arguments and holds the texts of the help.
- `src/usage.rs`: the command `usage`, which reads the tokens and the cost from the SQLite file only.
- `src/reading/`: the command `read`, the content that the tables do not store — see its own CONTEXT.md.
- `plugin.json` and `skills/heidrun-data/`: the Agent Plugin manifest and the standalone skill. The repository copy `.agents/skills/heidrun-data/` stays identical to the package skill. A test compares `SKILL.md` with the help and with the output of `schema`.
- `tests/`: the tests of the executable. The tests of the library sit at the end of each source file.
- Command to run this folder: `pnpm --silent data_layer:heidrun_data --help`
- Command to test this folder: `pnpm --filter heidrun_data test`

## Rules
- All four database defaults follow `HEIDRUN_CODE_DIR`; `tests/application_paths.rs` checks development, empty, and unset values in separate processes.
- The four sources are `source_control`, `code_hosting`, `coding_agents`, and `user_activity`. `update` and `initialize` always run them in this order. A source that fails does not stop the others: the command prints one error for each failed source, and exits with the code 1.
- `update` and `initialize` call the `synchronize` of each data layer library, never its executable. Only the four data layer packages create and write their tables: this package adds no table and no field.
- `usage` opens the SQLite file read only, never reads a chat session file, and fails with a clear message when the token usage was never read. A model without a price gives a null cost and `isCostComplete` false, never zero.
- `schema` prints the columns and the JSON schemas from the four packages, so this package copies no column and no field. `read` writes nothing and opens no SQLite file.
- `lock_database` is the one lock of the SQLite file: a lock in memory for the threads, and the lock file `<database>.lock` for the other programs. The desktop application and each source take it before each write.
- `query` and `sources` open the SQLite file read only. `query` adds `LIMIT <count>` (default 1000) to a statement that has none, and `--limit 0` adds nothing.
- The output is `jsonl`, `json`, or `table`: `table` on a terminal, `jsonl` otherwise. With a JSON format, every error is one JSON object on one line of the standard error output.
- `src/output.rs` only turns rows into text. Only `src/main.rs` prints progress lines.
- The calls are blocking. The package knows nothing about Tauri. The file `.cargo/config.toml` puts the compiled files in the Cargo target folder of `desktop_tauri`.

## Background
- The command `usage` comes from [issue #616](https://github.com/heidrun-org/heidrun/issues/616).
- The package is the plan of [issue #564](https://github.com/heidrun-org/heidrun/issues/564). `SKILL.md` was tried by a coding agent on this repository.
