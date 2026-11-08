# Repo Folders Constraints

Approved by the developer on 8 November 2026 in the configuration review in this conversation. Changes require human approval through The Rules of the Repo.

The tables list internal package imports; external dependencies remain subject to existing repository instructions.

## Packages

| Folder | Does | Never does | May import | Language and technologies | Workflow |
|---|---|---|---|---|---|
| packages/data_layers/data_layer_code_hosting | Reads GitHub issues and pull requests into SQLite | Call AI models; depend on desktop application | no other package | Rust, SQLite, JSON schemas | Existing package instructions; package build and tests |
| packages/data_layers/data_layer_source_control | Reads Git commits into SQLite | Call AI models; depend on desktop application | no other package | Rust, SQLite, JSON schemas | Existing package instructions; package build and tests |
| packages/data_layers/data_layer_coding_agents | Reads coding agent history and configuration; records usage and model prices | Call AI models; write coding agent configuration | no other package | Rust, SQLite, JSON schemas | Existing package instructions; package build and tests |
| packages/data_layers/data_layer_user_activity | Reads developer activity records into SQLite | Call AI models; depend on desktop application | no other package | Rust, SQLite, JSON schemas | Existing package instructions; package build and tests |
| packages/apps/heidrun_data | Provides one command line and library over the four data layer packages | Call AI models; own extra data layer tables | data_layer_code_hosting, data_layer_source_control, data_layer_coding_agents, data_layer_user_activity | Rust, SQLite | Existing package instructions; package build and tests |
| packages/dev_tools/agents_rules_checker | Checks Symbiospec file sizes | Become a runtime dependency of a data layer package | no other package | TypeScript, Vitest | Existing package instructions; pnpm --filter agents_rules_checker test |


## Other folders

These rows cover descendants unless a more specific row applies. A new package requires a new approved row. Existing CONTEXT.md restrictions continue to apply.

| Folder | Does | Never does | Language and technologies | Workflow |
|---|---|---|---|---|
| . | Workspace configuration and repository entry documents | Hold package implementation outside packages | pnpm workspace, Markdown | AGENTS.md and The Rules of the Repo |
| packages | Holds data_layers, apps and dev_tools groups | Hold packages directly | Rust packages with pnpm commands | New packages require approved rules |
| packages/data_layers | Holds independent data layer packages | Import another data layer package or heidrun_data | Rust, SQLite | Per-package rules |
| packages/apps | Holds combined product interfaces | Own extra data layer tables | Rust, SQLite | Per-package rules |
| packages/dev_tools | Holds developer-only packages | Supply runtime dependencies to product packages | Per-package rules | New packages require approved rules |
| docs | Holds project documentation | Present observations as human-approved requirements | Markdown | docs_folder_system |
| docs/symbio_spec | Holds product specification, decisions and coverage | Treat installation or tests as product approval | Markdown | symbio_spec and docs_folder_system |
| .agents/skills | Holds reusable skill instructions and references | Hold repository-specific configuration inside reusable skills | Markdown and upstream supporting files | Install requested skills; preserve upstream instructions |
| .agents/rules_of_the_repo | Holds active rule list and repository configuration | Activate unapproved rule values | Markdown | rules_of_the_repo; human approval for living rules |
| .agents/worktrees | Holds isolated issue worktrees | Become tracked product source | Git worktrees | issue_fix_workflow or issue_batch_workflow |
| .claude | Holds Claude Code instruction compatibility | Maintain competing copies of shared skills | Markdown, symbolic links | Import AGENTS.md; link shared skills |
| testbed_folder | Holds coding agent experiments and their results | Commit private databases | Existing scripts and generated reports | Existing testbed_folder/AGENTS.md and README.md |
| node_modules | Holds installed dependencies | Hold manually maintained source | Package manager output | pnpm install |
| target | Holds compiled Rust output | Hold manually maintained source | Cargo output | Build commands |

