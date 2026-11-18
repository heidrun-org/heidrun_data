# Configuration and limits

## Tool invocation

After the chosen tool revision is available on GitHub:

```bash
npx --yes github:jeromeetienne/faster_rust_worktrees#<reviewed-reference> --help
```

Replace `<reviewed-reference>` with an available reviewed branch, tag, or full commit identifier. A receiving repository can pin the Git dependency and invoke the installed executable instead. The repository is public; ordinary public GitHub access is sufficient. Development uses a pnpm monorepo; the repository-root npm entry package exposes the nested executable and includes runtime dependencies so GitHub installation does not need pnpm or workspace dependency resolution.

## Configuration

Create `.faster_rust_worktrees.yaml` at the root of the main checkout.

```yaml
baseRef: HEAD
worktreeDirectory: .agents/worktree
targetDirectories: [target]
cargoCommands:
  - cwd: "."
    argv: [cargo, build, --locked]
  - cwd: "."
    argv: [cargo, test, --locked, --no-run]
```

If the default YAML file is missing, the first command that loads configuration converts an existing `.faster_rust_worktrees.json` to `.faster_rust_worktrees.yaml` and loads the new file. The original JSON file stays in place. An existing JSON configuration can also be selected with `--config .faster_rust_worktrees.json` before the subcommand.

Use actual command working directories, features, profiles, and targets. Include every variant whose output cleanup must preserve. Multiple target directories are supported. Defaults are `HEAD`, `.agents/worktree`, and `["target"]`; Cargo commands are required. `--base` overrides the configured reference for one creation.

An optional `installCommand` has the same `cwd` and `argv` fields, for example `{ "cwd": ".", "argv": ["pnpm", "install", "--frozen-lockfile"] }`. Commands run without a shell. An installation failure leaves the worktree for diagnosis. Submodules are initialized at recorded commits before reuse and installation.

Ignore the nested worktree directory in Git before creation. Commit receiving-repository configuration before warming the original build; Cargo can otherwise observe a different source set between checkouts. The tool checks the ignore rule and refuses creation if missing.

Python 3 is required for exact nanosecond timestamps. JavaScript Date rounds timestamps and can invalidate Cargo build-script fingerprints.

All managed paths must remain within their checkout, without symbolic-link ancestors. Target folders cannot contain tracked source files. Unset `CARGO_TARGET_DIR`; inspect package configuration for absolute target paths too. Stop builds before cloning and cleanup. Cloning a mutating target folder is not a consistent snapshot. Cleanup does not synchronize with Cargo processes.

## Clone and relocation

On macOS, the tool tries `clonefile` through Python and falls back to `cp -c -R -p`. On Linux, GNU `cp --reflink=always -R -p` requires a file system supporting copy-on-write cloning. Unsupported cloning is reported explicitly; there is no ordinary-copy or hard-link fallback. macOS has live correctness evidence; Linux remains unverified until tested on a suitable actual file system.

The entire configured target folder is cloned independently. Every profile and target triple is retained. Cargo build-script `build/<unit>/output` records have original-checkout prefixes relocated. Compiled-in paths, generated files outside target folders, native caches, externally located dependencies, environment changes, and compiler changes may still require builds or extra setup.

Modification dates are reused only for identical tracked files. Changed and uncertain source files keep dates that allow Cargo to rebuild. A dirty original checkout may have output for different source content; verify the real result after creating from another revision.

## Cleanup

A Cargo `.rustc_info.json` marker is required before cleanup. Source files, symbolic-link managed paths, and uncertain descendants are protected. Stale age considers output access and modification dates, but operating systems may defer access-time updates: age is a heuristic, not proof that output is unused.

Pruning relies on Cargo debug fingerprint logs, which are not a stable interface. Every configured command must succeed and emit recognized hashes. Unknown entries and incremental caches are retained. Ensure all variants are configured; output for omitted variants can be considered obsolete. Preview may compile outdated sources. Removal recomputes the plan on each invocation; stop concurrent builds before applying.

## Workspace consolidation

The tool never rewrites Cargo manifests or lockfiles. If consolidation is needed, make that a separately reviewed receiving-repository change. Preserve locked package identities, versions, sources, and dependency edges, and run existing tests. Existing suitable workspaces should remain unchanged.
