# heidrun_data

This repository holds the data layer packages of Heidrun Organization.

The packages come from the folder `packages/data_layers` of the repository [heidrun_code](https://github.com/heidrun-org/heidrun_code). The packages move here in a separate issue.

## pnpm workspace

This repository is a pnpm workspace. Each package is a subfolder of the folder `packages`.

- `pnpm install`: install the packages of every package.
- `pnpm build`: build every package.
- `pnpm test`: run the tests of every package.

## Usage scenario

Run these commands in order from the root of this repository. They build the command line tool `heidrun_data`, fill a new SQLite file with the history of this repository, and then read this history. The SQLite file is in `/tmp`, so the commands do not change the SQLite file of the Heidrun Code application. The command `gh` must be installed and logged in.

```sh
# 1. Install the packages and build the command line tool heidrun_data.
pnpm install
pnpm build

# 2. Give a name to the command line tool and to a new SQLite file.
HEIDRUN_DATA=./target/debug/heidrun_data
DATABASE=/tmp/heidrun_data_playground.sqlite

# 3. Read the commits, the issues, and the pull requests of this repository into the SQLite file.
$HEIDRUN_DATA update source_control code_hosting --database $DATABASE

# 4. Read the chat sessions of Claude Code and of Codex in this repository, and their token usage.
$HEIDRUN_DATA update coding_agents --database $DATABASE

# 5. Show each source, its tables, and the number of rows of each table.
$HEIDRUN_DATA sources --database $DATABASE --format table

# 6. Show the tables, their columns, and their joins.
$HEIDRUN_DATA schema --database $DATABASE --format table

# 7. Show the subjects of the five last commits.
$HEIDRUN_DATA query --database $DATABASE --format table "SELECT json_extract(data, '$.subject') AS subject FROM commits ORDER BY committedAt DESC LIMIT 5"

# 8. Read one commit without its diff, and the issue number 1.
$HEIDRUN_DATA read commit HEAD --database $DATABASE --no-diff
$HEIDRUN_DATA read issue 1 --database $DATABASE

# 9. Show the tokens and the estimated cost of the chat sessions in this repository, one row per day.
$HEIDRUN_DATA usage --database $DATABASE --by day --format table

# 10. Show every command and every option.
$HEIDRUN_DATA --help
```

The full description of each command is in the [README of the package heidrun_data](packages/heidrun_data/README.md).
