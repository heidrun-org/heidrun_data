---
name: faster_rust_worktrees
description: Configure and verify the shared Faster Rust Work Trees tool in a Rust repository to reuse independent Cargo build output through copy-on-write cloning. Discover build commands, preserve source-change detection, and evaluate adoption.
---

# Faster Rust Work Trees 

**Status: Draft.** Synthetic correctness and independent project measurements do not alone establish that these instructions can be adopted without help. Keep draft status until reviewed independent adoption evidence supports changing status.

Use the shared tool from [Faster Rust Work Trees](https://github.com/jeromeetienne/faster_rust_worktrees). Configure the tool in the receiving repository; never copy or regenerate its implementation. Read [configuration and limits](references/setup.md) before making changes.

## Discover and prove feasibility

Read the receiving repository's rules. Identify Cargo workspaces, package lockfiles, target folders, features, profiles, environment, build scripts, and generated inputs. Record the actual build and test commands with their working directories, including package-specific `.cargo/config.toml`. Inspect `cargo metadata --no-deps --format-version 1` from those directories to locate output. Reject absolute/shared target paths and inherited `CARGO_TARGET_DIR` until output is checkout-local.

Preserve suitable existing workspaces. Consolidate separate workspaces only when needed and authorized: compare locked package identities, versions, sources, and dependency edges; resolve conflicting locks explicitly; run existing tests afterward. Consolidation is a receiving-repository change, not an automatic tool operation.

Name the assumption that can prevent reuse: this file system must support real copy-on-write clones of populated Cargo output that Cargo can reuse after relocation. Build the original checkout with the actual commands, then test the same pinned tool version in a disposable worktree on the same file system. Stop original builds while cloning. Retain exact commands and raw output. Missing output or unavailable cloning is an explicit ordinary-worktree result, never successful optimization.

## Configure and verify

1. Select an available reviewed Git reference for the tool. Use the same reference throughout evaluation. Installation from this private GitHub repository needs normal GitHub access; npm publication is not required.
2. Write receiving-repository configuration using [the configuration example](references/setup.md#configuration). Keep repository paths and commands outside this skill folder. Ignore the nested worktree directory in Git and commit the setup before warming builds; otherwise Cargo can include untracked configuration or nested worktree sources in build-script fingerprints.
3. Run the shared executable with `create <new-branch>`. Inspect every clone decision. Exact nanosecond dates require Python 3. Dates are restored only for unchanged tracked regular files and matching directory entries; Cargo build-script output records are relocated with their dates preserved.
4. Run every actual build and test command in the new worktree, with identical arguments and environment. Count `Compiling` lines; unchanged source should compile zero crates. Investigate rebuilds before claiming reuse.
5. Change source and check the actual program or test result. Verify build-script watched inputs, independence from original sources using disposable copies, and independent concurrent builds of two worktrees.
6. Compare `create <new-branch> --without-optimization` when diagnosing a failure.
7. Only after verification, update the receiving repository's worktree command, including its Issue Fix Workflow settings where used. Preserve established fetch policy, base reference, and worktree location.

The tool does not rewrite paths embedded in programs or arbitrary generated assets. Discover generated inputs and verify the real application rather than assuming Cargo success proves application independence.

## Cleanup and evidence

`clean --days 14` previews old registered worktree target folders and excludes the main checkout. `prune` runs every configured Cargo command from the configured working directory, keeps the union of recognized compilation hashes, and previews obsolete hashed output. Unknown names and incremental caches are retained. Failed commands or unrecognized logs prevent removal. Both commands need `--apply` to remove output, and require builds to be stopped; installation alone does not authorize removal.

Record environment, exact revision, commands, setup effort, unclear instructions, and manual interventions. For efficiency claims, warm the original checkout, compare ordinary and optimized worktrees at identical settings three times, and report creation time, first-build time, compiled crates, and physical disk measurement uncertainty. Apparent cloned sizes do not measure extra physical storage. Preserve first-attempt evidence before improving instructions or the tool.
