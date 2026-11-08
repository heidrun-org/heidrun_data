# Changelog

Notable changes to Heidrun Data, following [Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/).

Versions are retrospective. Dates follow the historical tagged milestones in Paris time, not publication dates. Version v0.1.0 covers development inherited from Heidrun Code, beginning on 11 October 2026.

## [Unreleased]

## [v0.3.0] - 2026-11-08

### Release notes

Explore images from Claude Code and Codex conversations, investigate a feature’s history, and read corrected cost totals across repositories.

**History exploration.** Chat image readers preserve image references, and Codex conversations can be found from terminal titles. The `feature-status` skill brings related history together in a feature report.

**Integration changes.** Packages are grouped by responsibility. Update integrations that use the previous package paths. The operation log is removed, and configuration uses `~/.config/heidrun_code` or `HEIDRUN_CODE_DIR`.

### Added

- Read images referenced by Claude Code chat messages, preserving their original image numbers. [heidrun_data #18].
- The `feature-status` skill for reports on a feature’s purpose, behavior, history, and open work. [heidrun_data #21].
- GitHub query counts, points used, and points remaining in code hosting synchronization reports. [heidrun_data #14].
- Codex chat images identified by both image number and message, and `find_codex_chat_id` to find a conversation from its terminal title and folder. [heidrun_data #22].

### Changed

- Move packages under `packages/data_layers`, `packages/apps`, and `packages/dev_tools`. Update integrations using former paths; package names and Rust behavior remain unchanged. [heidrun_data #31].
- Use The Rules of the Repo as the shared entry point for repository rules and coding agent instructions. [heidrun_data #29].
- Migrate agent documentation to Symbiospec and configure folder constraints. [commit a131502f].

### Removed

- The `data_layer_operation_log` package and `heidrun_data operations` command, including replay. [heidrun_data #15].
- Fallback to `~/.config/heidrun` and `HEIDRUN_DIR`. Use `~/.config/heidrun_code` or `HEIDRUN_CODE_DIR` instead. [heidrun_data #19].

### Fixed

- Include every repository when several repositories have token usage in the same hour, preventing understated combined costs. [heidrun_data #13].

## [v0.2.0] - 2026-10-25

### Release notes

Build and use Heidrun Data from its own repository, independently of the Heidrun Code application.

**Independent workspace.** The repository preserves the earlier package history and provides its own build, test, and usage instructions.

**Exploration and synchronization.** Interactive examples help explore repository activity and module history. Refreshes report progress, and incremental configuration updates avoid rewriting unchanged records.

### Added

- A standalone pnpm workspace with preserved Git history and usage instructions. [commit 2be0b431].
- An experiment folder with interactive repository activity and module history reports. [commit 224a0bc3].
- Progress reporting for GitHub and Git history refreshes. [heidrun_data #12].

### Changed

- Use `heidrun_data` for the combined package and heidrun-data for its skill in the separate repository. [commit f7183719].

### Fixed

- Avoid rewriting unchanged memory file, subagent, and skill records during incremental updates. [heidrun_data #12].

## [v0.1.0] - 2026-10-18

### Release notes

Read and query four sources of development history through one `heidrun_data` command: coding agent conversations and configuration, Git commits, GitHub issues and pull requests, and developer activity.

**Queries and original records.** Store facts in SQLite, inspect their schemas, and read the underlying conversations, commits, issues, and pull requests. Trace recorded file writes through `read file_history`.

**Usage and coding agent instructions.** Query token usage and estimated costs using stored model prices. The heidrun-data Agent Plugin supplies instructions and reference documents for coding agents. The data layer code does not call AI models.

### Added

- Cached chat summaries: dates, message counts, folders, issue and pull request references, and files written. [commit 82372019].
- Initialize, incrementally update, and query GitHub issues and pull requests in SQLite, with JSON schema validation. [heidrun_code #456].
- Chat sessions and links to folders, issues, pull requests, and files written. [heidrun_code #467].
- Git commits and merges stored in SQLite, with initialization, incremental updates, and read-only queries. [heidrun_code #469].
- Developer activity records imported from `user_activity.jsonl`, with time zone conversion and invalid-line reporting. [heidrun_code #476].
- The `heidrun_data` commands initialize, update, query, and sources for the four data layers. [commit bc3d10dc].
- The schema command, reading complete chat sessions, commits, issues, and pull requests, a shared database lock, and a coding agent skill. [heidrun_code #566].
- Memory files, subagents, and skills with creation, change, and removal dates; `read file_history` shows recorded tool calls that wrote a file. [heidrun_code #579].
- Token usage per minute, versioned model prices, the `token_usage_with_cost` database view, and `heidrun_data usage` for grouped totals. [heidrun_code #624].
- An `isError` field on chat records and visible reporting when `update --verbose` waits for the database lock. [heidrun_code #580].
- The heidrun-data Agent Plugin manifest and installation guidance, while keeping the executable named `heidrun_data`. [heidrun_code #696].
- The operations command for operation log inspection, summaries, replay, snapshots, and timing. [heidrun_code #632].

### Fixed

- Apply the query row limit when only a subquery has LIMIT, and read every page of pull request reviews and review comments. [heidrun_code #580].

[Unreleased]: https://github.com/heidrun-org/heidrun_data/compare/v0.3.0...main
[v0.1.0]: https://github.com/heidrun-org/heidrun_data/releases/tag/v0.1.0
[v0.2.0]: https://github.com/heidrun-org/heidrun_data/compare/v0.1.0...v0.2.0
[v0.3.0]: https://github.com/heidrun-org/heidrun_data/compare/v0.2.0...v0.3.0
[heidrun_data #18]: https://github.com/heidrun-org/heidrun_data/pull/18
[heidrun_data #21]: https://github.com/heidrun-org/heidrun_data/pull/21
[heidrun_data #14]: https://github.com/heidrun-org/heidrun_data/pull/14
[heidrun_data #22]: https://github.com/heidrun-org/heidrun_data/pull/22
[heidrun_data #31]: https://github.com/heidrun-org/heidrun_data/pull/31
[heidrun_data #29]: https://github.com/heidrun-org/heidrun_data/pull/29
[commit a131502f]: https://github.com/heidrun-org/heidrun_data/commit/a131502f9da6735d7e2226e8cf8007b7a2a00eca
[heidrun_data #15]: https://github.com/heidrun-org/heidrun_data/pull/15
[heidrun_data #19]: https://github.com/heidrun-org/heidrun_data/pull/19
[heidrun_data #13]: https://github.com/heidrun-org/heidrun_data/pull/13
[commit 2be0b431]: https://github.com/heidrun-org/heidrun_data/commit/2be0b431d2d420ac4276f9eb378f6fa3438f07c2
[commit 224a0bc3]: https://github.com/heidrun-org/heidrun_data/commit/224a0bc3320692712a14a95aa85595a834d5d020
[heidrun_data #12]: https://github.com/heidrun-org/heidrun_data/pull/12
[commit f7183719]: https://github.com/heidrun-org/heidrun_data/commit/f71837196baf6e4e1769b6dc594ae52d2c3a7d84
[commit 82372019]: https://github.com/heidrun-org/heidrun_data/commit/8237201917cf52e5e80bdc2997ca8a949e3bac15
[heidrun_code #456]: https://github.com/heidrun-org/heidrun_code/pull/456
[heidrun_code #467]: https://github.com/heidrun-org/heidrun_code/pull/467
[heidrun_code #469]: https://github.com/heidrun-org/heidrun_code/pull/469
[heidrun_code #476]: https://github.com/heidrun-org/heidrun_code/pull/476
[commit bc3d10dc]: https://github.com/heidrun-org/heidrun_data/commit/bc3d10dc6b6c23352ea6abdb500e01624b46401c
[heidrun_code #566]: https://github.com/heidrun-org/heidrun_code/pull/566
[heidrun_code #579]: https://github.com/heidrun-org/heidrun_code/pull/579
[heidrun_code #624]: https://github.com/heidrun-org/heidrun_code/pull/624
[heidrun_code #580]: https://github.com/heidrun-org/heidrun_code/pull/580
[heidrun_code #696]: https://github.com/heidrun-org/heidrun_code/pull/696
[heidrun_code #632]: https://github.com/heidrun-org/heidrun_code/pull/632
