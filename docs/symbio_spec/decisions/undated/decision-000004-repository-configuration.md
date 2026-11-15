# Decision 000004: Package grouping

- Created: 15 November 2026
- Last updated: 15 November 2026
- Status: Recorded human decision
- Related framing: [Symbiospec overview](../../README.md)
- Related rules: [Symbiospec](../../../../.agents/skills/symbio_spec/SKILL.md)
- Related issue: [issue 32](https://github.com/heidrun-org/heidrun_data/issues/32)

- Decision number: 000004
- History order: 4
- Decision date: Unknown — not recorded
- Topics: repository-configuration
- Outcome: Accepted
- Scope: Historical authorization only; original limits remain applicable
- Source: Migrated original record below
- Approval evidence: Recorded user instructions below; historical conversation was not independently retrieved
- Affected specifications: [Symbiospec](../../index.md)
- Related decisions: None recorded

## 0. Introduction

### 0.1. Purpose

Preserves the original authorization and its limits.

## 1. Decision

Group packages and coordinate Heidrun Code consumption as recorded; preserve review validation boundaries.

## 2. Reason

Unknown — not recorded, except where stated in the original record.

## 3. Effect on earlier decisions

No replacement recorded.

## 4. Unresolved conditions

Further product specification population remains deferred. Recorded imports do not establish independently verified historical approval or software compliance.

## 5. Original record

The quotation preserves the original bytes. Relative links inside the quotation use the former source location; use the structured navigation above.

````markdown
## 5. Package grouping

For issue [30](https://github.com/heidrun-org/heidrun_data/issues/30), the developer explicitly approved moving the four independent data layer packages under `packages/data_layers`, moving the combined heidrun_data package under `packages/apps`, and retaining developer tools under `packages/dev_tools`. Package names and responsibilities stay unchanged. Heidrun Code must adopt the new paths together with the updated submodule reference.

Heidrun Code consumes Heidrun Data through `submodules/heidrun_data`. After review, commit and publish Heidrun Data first. Then update the Heidrun Code submodule reference together with its Cargo workspace, desktop dependency paths, bundled skill resource, plugin discovery, build-cache paths, tests and documentation in one commit. An existing Heidrun Code checkout stays on its recorded submodule commit until that coordinated update.

Review validation used the moved packages copied into the initialized submodule of the isolated Heidrun Code worktree, without changing either main checkout or creating an intermediate commit. Heidrun Data passed `pnpm install --frozen-lockfile`, `pnpm build`, `pnpm test`, and the command line help check. Heidrun Code passed `cargo check --package heidrun_code --tests`, `cargo test --package heidrun_code --lib environment_file::tests`, `pnpm --filter worktree_tools test`, and `pnpm --filter data_layer_boundary_checker test`. These checks do not establish an application launch or release bundle.
````
