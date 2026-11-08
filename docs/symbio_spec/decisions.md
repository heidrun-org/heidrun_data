# Symbiospec decisions

- Created: 8 November 2026
- Last updated: 8 November 2026
- Status: Maintained configuration and import decisions
- Related framing: [Project instructions](../../AGENTS.md)
- Related rules: [Symbiospec](../../.agents/skills/symbio_spec/SKILL.md)

## 0. Introduction

This record distinguishes configuration authorization from product decisions.

## 1. Configuration authorization

On 8 November 2026, the developer approved the proposed rule configuration in this conversation, with the explicit condition that Symbiospec be initialized but not populated. The subsequent instruction “go ahead” authorized applying that configuration.

The authorization covers the folder structure, navigation, rule activation and these administrative records.

## 2. Product decisions

No new product decisions have been recorded or approved through this initialization. Existing source documentation remains in place. Product specification population is deferred.

## 3. Existing documentation import

On 8 November 2026, the developer requested “import docs/agents_rules in symbio_spec”. This authorizes importing the existing product definitions, superseding the earlier restriction on population for this bounded import. The official names and data layer concepts now belong to Glossary; synchronization outcomes belong to Behaviour. That initial import retained forwarding documents and left the agent workflow terminology and GitHub/GitLab rule in the old folder. Section 4 supersedes that arrangement.

The import does not introduce new product behaviour or establish independently verified historical approval. Further specification population remains deferred.

## 4. Complete replacement of the former agent rules folder

On 8 November 2026, the developer explicitly requested importing everything and removing the obsolete agent rules folder. This supersedes the earlier decision to retain agent workflow documents and forwarding files outside Symbiospec. All substantive content and reading instructions are now maintained in Symbiospec. The old folder is removed; repository references and the existing size checker now target Symbiospec. No unrelated skill is installed or removed.

## 5. Package grouping

For issue [30](https://github.com/heidrun-org/heidrun_data/issues/30), the developer explicitly approved moving the four independent data layer packages under `packages/data_layers`, moving the combined heidrun_data package under `packages/apps`, and retaining developer tools under `packages/dev_tools`. Package names and responsibilities stay unchanged. Heidrun Code must adopt the new paths together with the updated submodule reference.

Heidrun Code consumes Heidrun Data through `submodules/heidrun_data`. After review, commit and publish Heidrun Data first. Then update the Heidrun Code submodule reference together with its Cargo workspace, desktop dependency paths, bundled skill resource, plugin discovery, build-cache paths, tests and documentation in one commit. An existing Heidrun Code checkout stays on its recorded submodule commit until that coordinated update.

Review validation used the moved packages copied into the initialized submodule of the isolated Heidrun Code worktree, without changing either main checkout or creating an intermediate commit. Heidrun Data passed `pnpm install --frozen-lockfile`, `pnpm build`, `pnpm test`, and the command line help check. Heidrun Code passed `cargo check --package heidrun_code --tests`, `cargo test --package heidrun_code --lib environment_file::tests`, `pnpm --filter worktree_tools test`, and `pnpm --filter data_layer_boundary_checker test`. These checks do not establish an application launch or release bundle.
