# symbio_spec

Symbiospec is a shared product specification that humans can understand and approve, and coding agents can use to guide implementation and verification. The skill `symbio_spec` stores each receiving project's specification and related records under `docs/symbio_spec/`.

## Workflows

- **Initialize Symbiospec:** create the structure for new software, or build a small validated foundation for existing software and expand through slow growth.
- **Update Symbiospec as the software changes:** maintain the affected specifications in the same authorized development task.
- **Realign Symbiospec when drift is detected:** compare the approved specification with the software and relevant tests, report differences, and apply authorized corrections.

The specification separates Glossary, Behaviour, User Interface, Styling, Platform Support, and System Overview. Observed behaviour, proposed specifications, and approved expectations remain distinct. Human review uses prepared batches of concrete decisions so that review can proceed without lengthy investigations between individual answers.

## Install

```bash
npx skills add jeromeetienne/coding_agent_plugin --skill symbio_spec
```

Installing the skill does not initialize a project's documentation or approve product decisions. Initialization follows the receiving project's instructions and documentation conventions. Existing specifications and unrelated documentation are preserved.

## Use

Ask the coding agent to use `symbio_spec` for the relevant workflow. For example:

> Use symbio_spec to introduce Symbiospec into this existing software. Start with a small set of well-supported concepts and prepare the first review batch.

A request to inspect or review permits investigation and a report, not unrequested corrections. Realignment does not create a recurring automation by itself.

## Files

- [SKILL.md](SKILL.md): the instructions for selecting a workflow, preserving human intent, and preparing review.
- [Format](references/format.md): the folder structure, responsibilities of the six areas, document conventions, decisions, and coverage records.
- [Workflows](references/workflows.md): initialization, ongoing updates, and realignment.
