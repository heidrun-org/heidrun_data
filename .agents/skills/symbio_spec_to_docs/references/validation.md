# Contributor validation and distribution

This reference preserves contributor validation guidance previously included in the [skill overview](../README.md). The authoritative generation procedure remains in [SKILL.md](../SKILL.md); configuration requirements remain in [configuration.md](configuration.md).

## Discovery

The established distributed name is `symbio_spec_to_docs`, consistent with this repository's underscore-named skills. Before publishing skill changes, check discovery with the installation tool against a local checkout:

```bash
npx skills add /path/to/coding_agent_plugin --list
```

Replace the illustrative checkout path with the actual path. Listing is a discovery check, not proof of installation or documentation generation.

## Generic validator naming exception

The generic `skill-creator` validator described by the existing contributor guidance accepts only hyphens in skill names and therefore rejects `symbio_spec_to_docs`, as the validator rejects `symbio_spec`. Keep the distributed name unchanged.

When using that validator for other checks, use a temporary copy with only the frontmatter name changed to `symbio-spec-to-docs`. Report the naming exception separately and identify the validator version or local copy used. A check against the temporary copy does not validate the distributed name. Validator behaviour can change; inspect the validator being used before interpreting a rejection.

## Evidence to report

Report discovery, validator results and representative configured generation separately. Exercise generation using approved Symbiospec, current implementation evidence and a complete supplied configuration. Review one representative topic before expanding the set. Report source inspection, tests, application exercises, builds and publication checks only when performed; identify unavailable checks explicitly.

These commands and examples are guidance, not a record of checks executed for a particular release.
