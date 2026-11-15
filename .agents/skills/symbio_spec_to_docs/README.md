# symbio_spec_to_docs

Generate and update documentation inside a repository from approved Symbiospec and current implementation evidence, for a configured audience. Each documentation set has a separate configuration and destination folder.

## When to use

Use `symbio_spec_to_docs` to create a documentation set, review coverage, or update affected pages after product changes. A project can maintain separate user documentation and developer documentation. Only features supported by both approved Symbiospec and current implementation evidence are documented. Omitted topics and conflicts go into a separate review record.

## Requirements

The installed skill [symbio_spec](../symbio_spec/README.md), the project's Symbiospec data, relevant approval decisions, coverage records and implementation evidence are required. Missing either dependency stops generation; initialization and correction of Symbiospec are separate tasks.

Normal work requires the latest published Symbiospec format in the installed registry, currently `3.0.0`. The shared [version check and automatic migration procedure](../symbio_spec/references/versioning.md) runs first. Invoking this skill includes authorization to adopt unversioned data and migrate older formats with verified preservation, without a separate migration request. Explicit instructions forbidding changes block required migration and dependent work. Malformed, unknown or newer versions and failed or interrupted migrations stop normal work. Product approval and implementation permissions remain separate from storage conversion.

The caller must supply complete configuration for each requested set. The coding agent needs access to the configured sources and write access to the destination. Application access supports live checks; unavailable access must be reported. Renderer and publication tools are needed only when the configured task includes those checks or publication. The Rules of the Repo is optional.

## Install

```bash
npx skills add jeromeetienne/coding_agent_plugin --skill symbio_spec symbio_spec_to_docs
```

See the [collection installation guidance](../../README.md#install-the-skills). Installation does not create Symbiospec data, choose an audience or configure documentation sets.

## Configuration

Each named set has a `config.md` outside the installed skill folder. The caller supplies the path through a direct request, `AGENTS.md`, or a matching row in The Rules of the Repo. The [configuration reference](references/configuration.md) defines every required value and both registration forms.

Configuration selects the audience, application and specification evidence, included and excluded topics, user workflow, output, presentation and publication, review record and update procedure. All values must be usable before writing. Paths within configuration are relative to the repository root unless explicitly stated otherwise. Different sets need distinct destinations that are neither identical nor nested, and must not overwrite sources, configuration or review records.

Missing paths, dependencies or usable values stop generation with an explanation. The skill does not search for a configuration or choose an audience. An explicit `none` can exclude publication, but cannot replace required sources or audience information.

## Concrete example

The [configured documentation example](../../docs/about_symbio_spec/documentation_example.md) supplies a complete configuration for a fictional note editor. The example connects an approved save specification, implementation evidence, `docs/note_editor_help/index.md` and a separate review record. Paths and product information are illustrative inputs, not files created by installing the skill.

After the example project has established approved Symbiospec and completed its configuration, request:

> Use symbio_spec_to_docs with configuration documentation_config/note_editor_help/config.md. Generate the representative saving-a-Note topic and its introduction. Record gaps and verification limits in docs/documentation_reviews/note_editor_help.md. Do not publish.

The resulting help explains where to select Save and how to recognize success or failure. An approved but unimplemented autosave feature is omitted and reported. Expand a new set only after reviewing a representative topic and applying the findings.

## Results and ownership

The skill produces audience-facing pages and a separate review record mapping page sections to approval and implementation evidence. The record covers omitted topics, conflicts and checks performed. Report source inspection, executed tests, application exercises, documentation builds and deployed website checks separately. An example, a source review or a successful build does not establish live application behaviour or human acceptance.

`symbio_spec_to_docs` owns generated content in each configured destination and may rewrite passages edited by people. Corrections belong in Symbiospec or configuration, followed by regeneration. Preserve accurate content and unrelated pages; generated ownership does not authorize replacing unrelated documents or other sets. Updates use source mapping to find affected pages; establish missing mapping before updating the affected scope.

## Approval and publication boundaries

Use only approved specification content supported by implementation evidence. Do not silently repair product meaning in Symbiospec during generation; required format migration is announced and completed first. Omit unsupported instructions or explain a supported current limitation; record conflicts that prevent accurate guidance. Configuration changes follow the authority specified by the configuration or its rules-list row. An ordinary source update does not authorize an audience change.

Writing and publication are separate actions. A publication destination in configuration does not itself authorize deployment. Use the configured workflow within the requested scope and report publication separately from content review. When publication is authorized, the instructions require a representative test of an unproven hosting assumption and checks in a real browser.

## Related skills and guides

- Required: [symbio_spec](../symbio_spec/README.md) maintains the approved product information used for generation.
- Optional: [rules_of_the_repo](../rules_of_the_repo/README.md) can pass each set's configuration and govern configuration changes.
- [About Symbiospec](../../docs/about_symbio_spec/README.md) explains the source model and contains both examples.

## Instructions and references

- [SKILL.md](SKILL.md): dependencies, scope, generation, ownership, updates and verification.
- [Configuration reference](references/configuration.md): fields, registration forms and multiple sets.
- [Contributor validation](references/validation.md): discovery checks and the underscore-name validator exception.

Imported from the reusable [symbio_spec_to_docs skill](https://github.com/heidrun-org/heidrun_notebook/blob/main/.agents/skills/symbiospec_to_docs/SKILL.md), with configuration reviewed in [pull request 466](https://github.com/heidrun-org/heidrun_notebook/pull/466). The import and additional requirements are tracked in [issue 27](https://github.com/jeromeetienne/coding_agent_plugin/issues/27). Application-specific configuration and generated pages remain outside the reusable skill.
