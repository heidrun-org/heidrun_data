# symbio_spec_to_docs

Generate and update documentation inside a repository from the project's approved Symbiospec and current implementation. The skill requires [symbio_spec](../symbio_spec/README.md) and the project's Symbiospec data.

Each documentation set has its own configuration, audience and destination folder. A project can maintain user documentation and developer documentation separately. The skill owns the generated documentation and may rewrite the documentation during updates. Corrections go through Symbiospec or the configuration, followed by regeneration.

Only implemented features supported by approved Symbiospec are documented. Approved but unimplemented features, and implemented features missing from Symbiospec, are omitted and reported in a separate review record. Source inspection, executed tests, live verification, documentation builds and publication are reported separately.

## Install

Install both skills in the receiving project:

```bash
npx skills add jeromeetienne/coding_agent_plugin --skill symbio_spec symbio_spec_to_docs
```

Installation does not create Symbiospec data, choose an audience or configure documentation sets. Use `symbio_spec` to establish the project's product information first.

## Configure and use

Prepare each documentation set's configuration using the [configuration reference](references/configuration.md). All required values must be usable before generation starts. Configuration files live outside the installed skill folder.

- With The Rules of the Repo, put configurations with the other rule configurations and supply each configuration path through the matching rules-list row.
- Without The Rules of the Repo, supply a configuration path in the request or in `AGENTS.md`.

For example, after the project has chosen and completed `documentation_config/user_documentation/config.md`:

> Use symbio_spec_to_docs with configuration documentation_config/user_documentation/config.md to update the user documentation.

Both invocation forms require the same configuration and use the same workflow. Missing paths, dependencies or required values stop generation with an explanation. The skill does not choose a default configuration or audience.

## Validation and distribution

The established name is `symbio_spec_to_docs`, consistent with this repository's underscore-named skills. Use the installation tool's `--list` option against a local checkout to check discovery before publication:

```bash
npx skills add /path/to/coding_agent_plugin --list
```

The generic `skill-creator` validator accepts only hyphens in skill names and therefore rejects this name, as the validator rejects `symbio_spec`. Keep the distributed name unchanged. When using that validator for the other checks, use a temporary copy with only the frontmatter name changed to `symbio-spec-to-docs`, and report the naming exception separately. Passing that check does not prove discovery or documentation behaviour; check those with the real installation tool and representative configured generation.

## Files

- [SKILL.md](SKILL.md): dependency, configuration, generation, ownership and update instructions.
- [Configuration reference](references/configuration.md): required values and examples of both invocation forms and multiple documentation sets.

## Source

Imported from the reusable [symbio_spec_to_docs skill](https://github.com/heidrun-org/heidrun_notebook/blob/main/.agents/skills/symbiospec_to_docs/SKILL.md), with the configuration interface reviewed in [pull request 466](https://github.com/heidrun-org/heidrun_notebook/pull/466). The import and the additional requirements are tracked in [issue #27](https://github.com/jeromeetienne/coding_agent_plugin/issues/27). Application-specific configuration and generated pages are not part of this skill.
