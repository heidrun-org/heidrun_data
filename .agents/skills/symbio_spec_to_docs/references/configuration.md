# Documentation set configuration

Keep one configuration per named documentation set, outside the installed skill folder. Replace all placeholders below with the project's choices before generation. This template supplies field names, not default audiences, application paths or publication choices.

```markdown
# <documentation name> configuration

- Documentation name: <unique name of this set>
- Documentation type: <user documentation, developer documentation, or another type>
- Audience: <intended readers, goals and assumed knowledge>
- Application: <product name; implementation and relevant test locations>
- Symbiospec: <specification entry point; decision records; coverage records>
- Included topics: <topics within the scope of this set>
- Excluded topics: <topics that must stay out, or none>
- User workflow: <entry point and supported way this audience uses the product>
- Output: <destination folder inside this repository; introduction page in that folder>
- Presentation and publication: <format or renderer; publication destination and workflow, or none; files to publish>
- Review record: <separate file or other explicit location for source mapping, gaps and check results>
- Update procedure: <when to update; who may authorise configuration changes; content review procedure>
```

`none` is an intentional choice only where the value can be absent, such as publication or excluded topics. An empty field, unresolved placeholder, unspecified audience or unavailable source is not a usable configuration. Review records must have an explicit location, even when the location is the conversation. Resolve paths inside the configuration from the repository root unless that configuration explicitly supplies another base. Markdown links in a rules list or in `AGENTS.md` resolve from the file containing the link; pass the resolved configuration path to the skill.

## With The Rules of the Repo

Use the repository's existing rules list and configuration root. Under that root, give `symbio_spec_to_docs` its configuration folder, with a separate subfolder for each documentation set when several sets exist. For example, if a project has chosen `.agents/rules_of_the_repo/config/` as its configuration root:

```text
.agents/rules_of_the_repo/config/symbio_spec_to_docs/
  user_documentation/config.md
  developer_documentation/config.md
```

If the rules list is `.agents/rules_of_the_repo/rules_list.md`, the corresponding rows can be:

```markdown
| Skill | When it applies | Rule type | Configuration |
| --- | --- | --- | --- |
| [symbio_spec_to_docs](../skills/symbio_spec_to_docs/SKILL.md) | User documentation or covered Symbiospec and application changes | Living rule with human approval | [User documentation](config/symbio_spec_to_docs/user_documentation/config.md) |
| [symbio_spec_to_docs](../skills/symbio_spec_to_docs/SKILL.md) | Developer documentation or covered Symbiospec and application changes | Living rule with human approval | [Developer documentation](config/symbio_spec_to_docs/developer_documentation/config.md) |
```

Those paths and the rule type are examples, not requirements for another repository. Use the installed skill's actual path. Configuration changes follow the rule type of the matching row. Both matching rows may apply to a product change; pass each configuration separately and update only affected pages. Installing or registering `symbio_spec_to_docs` does not install `symbio_spec` or create Symbiospec data.

## Without The Rules of the Repo

A direct request can name the set and pass its configuration path:

> Use symbio_spec_to_docs with configuration `documentation_config/user_documentation/config.md` to update the user documentation.

Or register explicitly chosen paths in `AGENTS.md`:

```markdown
## Symbiospec to documentation

Follow [symbio_spec_to_docs](.agents/skills/symbio_spec_to_docs/SKILL.md) when generating or updating the configured documentation and when covered Symbiospec or application behaviour changes. The installed skill symbio_spec and the project's Symbiospec data are required.

- User documentation configuration: [config.md](documentation_config/user_documentation/config.md)
- Developer documentation configuration: [config.md](documentation_config/developer_documentation/config.md)
```

These are representative paths chosen by an example project. The request or repository instructions must supply the actual paths. The required values and generation workflow are identical for both invocation forms.

## Multiple documentation sets

Give each set a distinct name, audience definition, configuration and destination folder. For example, a project could choose `docs/user_documentation/` and `docs/developer_documentation/`; neither folder is a default. Identical or nested destination folders would allow one generation to overwrite another set, so use separate folders. Keep generated destinations separate from Symbiospec data, application sources, configuration and review records.

Each destination contains documentation owned by `symbio_spec_to_docs`. Corrections go through the responsible Symbiospec data or configuration and then regeneration. An update may rewrite generated passages regardless of who last edited the passages. Accurate content should remain useful across updates, without requiring preservation of manual edits as a separate source of truth.
