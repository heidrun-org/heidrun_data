# Reading the specification

- Created: 25 October 2026
- Last updated: 8 November 2026
- Status: Imported documentation conventions
- Related framing: [Symbiospec](../README.md)
- Related issue: [issue 10](https://github.com/heidrun-org/heidrun_data/issues/10)

## 0. Introduction

This document preserves the reading instructions of the former agent rules folder and its glossary. Symbiospec replaces that folder.

## 1. Read the relevant documents

Read the [glossary](../glossary/index.md) first because the glossary defines the words used by the other documents. Read only the topics that match the change, then follow the [Symbiospec index](../index.md) to the applicable specifications and rules.

The glossary provides one short definition for each project term. Use the defined words in code, documents and conversations. One word means one thing, and one thing has one word.

## 2. Maintain the documentation

The coding agents read and write these documents. Update a specification or glossary entry in the same change that makes the specification or entry inaccurate. Each folder index lists its files and subfolders and explains when to read each document.

Keep each file within the maximum size stated in [AGENTS.md](../../../AGENTS.md), split larger files by topic and update the indexes. Run `pnpm --filter agents_rules_checker test` after specification changes. This existing package now checks Symbiospec.

## 3. Imported document navigation

- [Official names](../glossary/heidrun_names.md): application, package and tool names.
- [Data layer concepts](../glossary/data_layer.md): sources, packages and the SQLite file.
- [Synchronization](../behaviour/synchronization.md): initialize and update descriptions.
- [Issue Fix Workflow](../glossary/issue_fix_workflow.md): workflow parts and added requests.
- [GitHub and GitLab support](../behaviour/github_and_gitlab_support.md): equivalent support, terminology and commands.
