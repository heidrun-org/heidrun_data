# Symbiospec coverage

- Created: 8 November 2026
- Last updated: 8 November 2026
- Status: Partial coverage from existing documentation import
- Related framing: [Project instructions](../../AGENTS.md)
- Related rules: [Symbiospec](../../.agents/skills/symbio_spec/SKILL.md)

## 0. Introduction

This record states the limited initialization scope and known documentation differences.

## 1. Coverage

Glossary contains the imported [official names](glossary/heidrun_names.md) and [data layer concepts](glossary/data_layer.md). Behaviour contains the imported [synchronization modes](behaviour/synchronization.md). System Overview contains the imported reading instructions. User Interface, Styling and Platform Support remain unpopulated. No implementation behaviour or platform support was tested during import.

## 2. Existing sources

The [repository overview](../../README.md), [imported glossary](glossary/index.md), package manifests and package CONTEXT.md files informed configuration. The two product glossary documents were imported with original source issue references retained. The Issue Fix Workflow glossary, GitHub/GitLab rule and documentation reading instructions have also moved into Symbiospec. The former folder and forwarding documents have been removed. Import authorization is recorded in [decisions](decisions.md); historical product approval was not independently verified.

## 3. Known documentation differences

Several package CONTEXT.md files retain references to the original desktop checkout, its Cargo target folder and pnpm worktree:create. These references remain unverified legacy documentation, not newly adopted folder constraints. The repository overview still describes the package move as pending although the packages are present. These differences are recorded for later investigation; initialization does not correct those documents.

## 4. Deferred work

Further product specification population beyond the requested import is deferred at the developer’s request. No next increment or recurring review is scheduled. A future request can select a small scope for investigation and human review.
