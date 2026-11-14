# symbio_spec

Symbiospec is the shared product specification for humans and AI. Humans can understand and approve Symbiospec, and AI uses Symbiospec to guide implementation and verification. The skill `symbio_spec` keeps each receiving project's specification and related records under `docs/symbio_spec/`.

## Why the name Symbiospec

Symbiospec is short for “Symbiotic Spec”. “Symbiotic” expresses the collaboration between humans and AI toward one shared goal: building the same product together. Humans and AI contribute different abilities, and Symbiospec gives humans and AI a common reference for describing, discussing, and agreeing on the product to build.

## When to use

Use `symbio_spec` to introduce Symbiospec into new or existing software, maintain approved expectations during development, or investigate differences between approved expectations, software and tests. Request **Symbiospec Audit for self-consistency** to review agreement within Symbiospec, or **Symbiospec Audit for software compliance** to compare software and approved Symbiospec in both directions, including undocumented software capabilities. The [shared workflow guide](../../docs/about_symbio_spec/workflows.md) explains Initialization, Update, Realignment, and both audits with examples.

The specification separates Glossary, Behaviour, User Interface, Styling, Platform Support and System Overview. The [shared definition](../../docs/about_symbio_spec/what_is_symbio_spec.md) explains the purpose and current limits; the [area guide](../../docs/about_symbio_spec/areas.md) explains which area owns each fact.

## Requirements

The coding agent needs access to repository instructions, existing specifications and relevant project evidence. Existing software may require reading source code, tests, Git history and issue discussions, plus permitted application observation. Record unavailable evidence rather than claiming complete coverage. A person must make product decisions that are not already authorized.

No companion skill is always required. Follow the receiving project's documentation rules, including `docs_folder_system` when required. No application framework, renderer or hosting service is required.

## Install

```bash
npx skills add jeromeetienne/coding_agent_plugin --skill symbio_spec
```

See the [collection installation guidance](../../README.md#install-the-skills). Installation does not initialize project documentation or approve product decisions.

## Configuration and adoption

`symbio_spec` needs no separate configuration file. Project data belongs at `docs/symbio_spec/`, relative to the receiving repository root. During authorized initialization, the coding agent adds a short instruction pointer using the actual installed skill path. The [format reference](references/format.md#1-repository-structure) gives the structure and pointer requirements.

The whole-folder format starts at `1.0.0`, separately from the skill release version. The [versioning reference](references/versioning.md) defines the Markdown version record, Semantic Versioning, compatibility checks, and consecutive migrations. An absent record means the existing unversioned format, equivalent to `1.0.0`; adopting the record preserves every existing specification file. Malformed or unsupported versions and incomplete migrations stop normal work. Installation alone does not add the record or migrate a project.

New software starts with folder overviews, indexes, decisions and coverage records, then develops useful content through Update. Empty templates are not approved definitions. Existing software requires a bounded inspection, prepared human review and repeated small increments. Adoption effort depends on the examined scope, evidence quality and decisions needed; installation does not reconstruct a whole product. Preserve useful existing specifications and approvals, proposing moves or splits before migration.

## Concrete example

For an illustrative note editor, request:

> Use symbio_spec to introduce Symbiospec into this existing note editor. Inspect saving one Note, propose the Note definition and save expectations, and prepare the first review batch. Do not change the application.

A small proposed specification separates these facts:

| Area | Example content |
| --- | --- |
| Glossary | A Note is a named piece of editable text retained for later use. |
| Behaviour | Saving a Note retains the current text; a failed save reports failure without claiming success. |
| User Interface | The Note editor exposes a Save control linked to the save Behaviour. |

These are fictional proposals, not approved requirements or claims about any real product. The [complete specification example](../../docs/about_symbio_spec/specification_example.md) shows file placement, cross-references, review decisions and coverage.

## Results and review

Initialization produces a useful, explicitly scoped foundation, with proposals separated from approved specifications. `decisions.md` records actual authorization and `coverage.md` records examined areas, partial coverage and known differences. Update changes affected specifications alongside authorized software changes. Both audits produce scoped findings with evidence and limitations. Realignment can use those findings to prepare and apply authorized corrections; a saved report belongs under `docs/symbio_spec/reports/` when saving is authorized.

Review product meaning, supporting evidence, approval references, links and coverage. Documentation approval does not prove that application tests ran. Results distinguish documentation checks, implementation checks and unresolved findings.

## Approval boundaries

Existing product authorization applies without asking again. Additional product decisions require review before adoption. Observed behaviour, proposed specifications and approved expectations remain distinct. A request to inspect or review permits investigation and a report, not unrequested corrections. The human controls which audit runs, the scope, and the timing, and may defer an audit. Neither audit runs automatically after every rule change or becomes a prerequisite for approving a rule. Apparent conflicts already noticed during discussion are reported without automatically launching deeper review. Undocumented software behaviour is a finding for discussion, not an approved requirement. Realignment does not create a recurring automation. Never rewrite approved expectations silently to accommodate a regression or conflicting test.

## Related skills and guides

- [docs_folder_system](../docs_folder_system/README.md) supplies document form and navigation when the receiving project requires those conventions.
- [symbio_spec_to_docs](../symbio_spec_to_docs/README.md) uses approved Symbiospec and implementation evidence to produce configured audience documentation; generation is a separate task.
- [issue_batch_workflow](../issue_batch_workflow/README.md) can implement several approved changes through linked parent and sub-issues.
- [About Symbiospec](../../docs/about_symbio_spec/README.md) provides the shared definition, areas, workflows and examples.

## Instructions and references

- [SKILL.md](SKILL.md): workflow selection, intent, human review and evidence requirements.
- [Format registry](references/format.md): published versions and links to retained definitions.
- [Format 1.0.0](references/format-v1.0.0.md): authoritative structure, six area responsibilities, document conventions, decisions and coverage.
- [Versioning and migration](references/versioning.md): version record, detection, compatibility, consecutive conversion and recovery.
- [Worked verification examples](references/versioning_examples.md): representative adoption, detection, conversion and interruption exercises.
- [Workflows](references/workflows.md): overview linking to the separate workflow procedures.
- [Symbiospec Audit for self-consistency](references/workflow_audit_self_consistency.md): review agreement within the selected specification scope.
- [Symbiospec Audit for software compliance](references/workflow_audit_software_compliance.md): compare software and approved Symbiospec in both directions.
