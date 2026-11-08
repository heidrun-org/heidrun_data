# Glossary of heidrun_data: the data layer

- Created: 25 October 2026
- Last updated: 8 November 2026
- Status: Imported existing specification; approval history not independently verified
- Related framing: [Project instructions](../../../AGENTS.md)
- Related rules: [Symbiospec glossary](index.md)
- Related issue: [issue 10](https://github.com/heidrun-org/heidrun_data/issues/10)

## 0. Introduction

This document gives one short definition for each word of the data layer. The other words of the project are in [index.md](index.md). The rules of each package are in the file `CONTEXT.md` of its folder.

## 1. Data layer package

A package of the folder `packages` whose folder name starts with `data_layer_`, that reads the facts of one source into tables of the SQLite file. The package `heidrun_data` is not a data layer package.

## 2. Source

The origin of the facts that one data layer package reads. The four sources are `source_control` (the Git commits), `code_hosting` (the GitHub issues and pull requests), `coding_agents` (the chat sessions of Claude Code and of Codex), and `user_activity` (the user activity records).

## 3. SQLite file

The one database file that every data layer package writes its tables into. The [folder constraints](../../../.agents/rules_of_the_repo/repo_folders_constraints/folder_rules.md) define package sharing and import boundaries.

## 4. Initialize and update

The synchronization modes are defined in [Behaviour](../behaviour/synchronization.md).

## 5. Import evidence

Imported from `docs/agents_rules/glossary/data_layer.md` at the developer’s request on 8 November 2026. The original issue reference is retained. Historical product approval and implementation behaviour were not independently verified during this documentation import.
