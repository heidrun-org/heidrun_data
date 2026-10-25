# Glossary of heidrun_data: the data layer

- Created: 25 October 2026
- Last updated: 25 October 2026
- Status: Maintained glossary for agents and tools
- Related framing: [Project instructions](../../../AGENTS.md)
- Related rules: [Glossary of heidrun_data](index.md)
- Related issue: [issue 10](https://github.com/heidrun-org/heidrun_data/issues/10)

This document gives one short definition for each word of the data layer. The other words of the project are in [index.md](index.md). The rules of each package are in the file `CONTEXT.md` of its folder.

### Data layer package

A package of the folder `packages` whose folder name starts with `data_layer_`, that reads the facts of one source into tables of the SQLite file. The packages `heidrun_data` and `data_layer_operation_log` are not data layer packages.

### Source

The origin of the facts that one data layer package reads. The four sources are `source_control` (the Git commits), `code_hosting` (the GitHub issues and pull requests), `coding_agents` (the chat sessions of Claude Code and of Codex), and `user_activity` (the user activity records).

### SQLite file

The one database file that every data layer package writes its tables into. The data layer packages share only the SQLite file, and no data layer package imports another data layer package.

### Initialize and update

The two modes of a data layer package. The mode initialize reads every fact of the source since the beginning. The mode update reads only the facts that changed since the last read. Each mode can run again and again, and never writes a row two times.

### Operation log

The record of each call of a public function of a package of the folder `packages`: one start event and one completion event. The package `data_layer_operation_log` writes it and reads it.
