# Examination 000001: Legacy imported coverage account

- Created: 15 November 2026
- Last updated: 15 November 2026
- Status: Recorded examination
- Related framing: [Symbiospec overview](../../README.md)
- Related rules: [Symbiospec](../../../../.agents/skills/symbio_spec/SKILL.md)
- Related issue: [issue 32](https://github.com/heidrun-org/heidrun_data/issues/32)

- Examination number: 000001
- History order: 1
- Examination date: Unknown — not recorded
- Topics: documentation-import
- Purpose and source request: Preserve the existing imported coverage account; original request details are not independently available
- Requested scope: Existing documentation import and known differences
- Methods: Historical documentation inspection, as described below
- Examined areas: Imported glossary, behaviour and reading instructions
- Unexamined areas: Application behaviour; platform support; all areas not explicitly described below
- Specification revision: Unknown — not recorded
- Approved scope: Import authorization only; [original decision history](../../decisions/index.md)
- Software revision and environment: Unknown — not recorded; software was not exercised during this coverage account
- Evidence: [current specification navigation](../../index.md); original account below
- Executed checks and raw output: None recorded; no new application checks are attributed to this historical account
- Related examinations: None recorded

## 0. Introduction

### 0.1. Purpose

Preserves one inseparable legacy coverage account with unknown examination date. The original last-updated date is administrative metadata, not proof of an examination date.

## 1. Scope, findings and limitations

# Symbiospec coverage

- Created: 8 November 2026
- Last updated: 15 November 2026
- Status: Partial coverage from existing documentation import
- Related framing: [Project instructions](../../../../AGENTS.md)
- Related rules: [Symbiospec](../../../../.agents/skills/symbio_spec/SKILL.md)

## 0. Introduction

This record states the limited initialization scope and known documentation differences.

## 1. Coverage

Glossary contains the imported [official names](../../glossary/heidrun_names.md) and [data layer concepts](../../glossary/data_layer.md). Behaviour contains the imported [synchronization modes](../../behaviour/synchronization.md). System Overview contains the imported reading instructions. User Interface, Styling and Platform Support remain unpopulated. No implementation behaviour or platform support was tested during import.

## 2. Existing sources

The [repository overview](../../../../README.md), [imported glossary](../../glossary/index.md), package manifests and package CONTEXT.md files informed configuration. The two product glossary documents were imported with original source issue references retained. The Issue Fix Workflow glossary, GitHub/GitLab rule and documentation reading instructions have also moved into Symbiospec. The former folder and forwarding documents have been removed. Import authorization is recorded in [decisions](../../decisions/index.md); historical product approval was not independently verified.

## 3. Known documentation differences

Several package CONTEXT.md files retain references to the original desktop checkout, its Cargo target folder and pnpm worktree:create. These references remain unverified legacy documentation, not newly adopted folder constraints. The repository overview still describes the package move as pending although the packages are present. These differences are recorded for later investigation; initialization does not correct those documents.

## 4. Deferred work

Further product specification population beyond the requested import is deferred at the developer’s request. No next increment or recurring review is scheduled. A future request can select a small scope for investigation and human review.


## 2. Next proposed increment

Further population remains deferred; no new audit or recurring examination is authorized by migration.

## 5. Original record

The quotation preserves the original bytes. Relative links inside the quotation use the former source location; use the structured navigation above.

````markdown
# Symbiospec coverage

- Created: 8 November 2026
- Last updated: 15 November 2026
- Status: Partial coverage from existing documentation import
- Related framing: [Project instructions](../../AGENTS.md)
- Related rules: [Symbiospec](../../.agents/skills/symbio_spec/SKILL.md)

## 0. Introduction

This record states the limited initialization scope and known documentation differences.

## 1. Coverage

Glossary contains the imported [official names](glossary/heidrun_names.md) and [data layer concepts](glossary/data_layer.md). Behaviour contains the imported [synchronization modes](behaviour/synchronization.md). System Overview contains the imported reading instructions. User Interface, Styling and Platform Support remain unpopulated. No implementation behaviour or platform support was tested during import.

## 2. Existing sources

The [repository overview](../../README.md), [imported glossary](glossary/index.md), package manifests and package CONTEXT.md files informed configuration. The two product glossary documents were imported with original source issue references retained. The Issue Fix Workflow glossary, GitHub/GitLab rule and documentation reading instructions have also moved into Symbiospec. The former folder and forwarding documents have been removed. Import authorization is recorded in [decisions](decisions/index.md); historical product approval was not independently verified.

## 3. Known documentation differences

Several package CONTEXT.md files retain references to the original desktop checkout, its Cargo target folder and pnpm worktree:create. These references remain unverified legacy documentation, not newly adopted folder constraints. The repository overview still describes the package move as pending although the packages are present. These differences are recorded for later investigation; initialization does not correct those documents.

## 4. Deferred work

Further product specification population beyond the requested import is deferred at the developer’s request. No next increment or recurring review is scheduled. A future request can select a small scope for investigation and human review.
````
