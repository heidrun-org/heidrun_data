---
name: symbio_spec
description: Create and maintain Symbiospec, the shared product specification in docs/symbio_spec/. Use to initialize Symbiospec for new or existing software, update the specification alongside authorized software changes, request Symbiospec Audit for self-consistency or Symbiospec Audit for software compliance, or resolve drift between the specification, software, and tests.
---

# Symbiospec

## 1. Purpose and location 

Symbiospec is the shared product specification through which humans and coding agents define software together. Humans understand and approve product decisions; coding agents use those decisions to guide implementation and verification.

Store project-specific specifications, proposals, decisions, coverage records, and comparison reports under `docs/symbio_spec/`, relative to the target repository root. This is not the operating system's `/docs` folder. Keep reusable instructions and templates in this skill, separate from project data.

Read the target repository's instructions and applicable context files first. Follow existing documentation conventions, including `docs_folder_system` when required by the repository. Preserve unrelated documentation and local changes. Installing this skill alone does not initialize product documentation or approve product decisions.

## 2. Select the workflow

**Expected Symbiospec format: `1.0.0`. Supported formats: `1.0.0` and its unversioned equivalent.** Before setup or normal work, including read-only audits, follow the shared [version detection and migration procedure](references/versioning.md). Installation that only copies skill files defers this check to first project use. A malformed version, unsupported format, or incomplete migration blocks normal work; report the problem before changing project data. Use existing authorization for adoption or migration; a version mismatch alone does not authorize conversion.

Read [format.md](references/format.md) and the detected version's complete definition before creating or restructuring Symbiospec. Use the [workflow overview](references/workflows.md) to select the relevant workflow below.

| Request | Workflow |
| --- | --- |
| Start a new project with Symbiospec | [Initialize Symbiospec](references/workflow_initialize.md): initialize the structure and templates, then use Update as development begins. |
| Introduce Symbiospec into existing software | [Initialize Symbiospec](references/workflow_initialize.md) through slow growth: establish a small validated foundation and expand iteratively. |
| Adopt existing specifications | [Initialize Symbiospec](references/workflow_initialize.md): inspect and preserve useful content and approvals; propose an incremental migration. |
| Develop an authorized software change with an established Symbiospec | [Update Symbiospec as the software changes](references/workflow_update.md): update the affected specifications in the same task. |
| Check whether approved Symbiospec descriptions agree internally | [Symbiospec Audit for self-consistency](references/workflow_audit_self_consistency.md): review the requested specification scope without testing software. |
| Compare approved Symbiospec with software in both directions | [Symbiospec Audit for software compliance](references/workflow_audit_software_compliance.md): report conflicting, missing, and unverified behaviour. |
| Investigate and resolve differences between Symbiospec, software, and tests | [Realign Symbiospec when drift is detected](references/workflow_realign.md): compare without modifying, report differences, then apply authorized corrections. |

Read only the workflow references relevant to the request. Both audits require an explicit request; the human chooses either audit or both audits, the scope, and the timing, including deferral until later. Do not automatically launch either audit or check affected approved user scenarios after every rule change. During discussion, mention apparent conflicts already noticed; a warning does not launch an investigation or make an audit a prerequisite for approving a rule. Never silently change approved user scenarios to remove a warning.

Keep checks scoped to the request. A request to inspect or review permits investigation and a report, not unrequested corrections. Realignment is a repeatable operation, not permission to create a scheduled automation.

## 3. Preserve human intent

- Distinguish observed implementation, proposed specification, and approved specification. Confidence in evidence is separate from human approval.
- Use existing authorization for product changes. Do not ask the human to approve the same decision again. Present additional product decisions beyond that authorization before adopting them.
- Never silently rewrite approved expectations to accommodate an implementation regression or a conflicting test. Report the difference and propose the correction to the software, specification, tests, or a combination.
- Define one canonical identity and name for each concept. Investigate historical aliases; do not blindly rename code, stored data, or external interfaces.
- Keep every fact in its responsible section and link to that fact elsewhere. Read the affected approved specifications before changing related software.
- Preserve partial coverage and uncertainty. Approval of documentation is not proof that the software was tested or that every feature is documented.

## 4. Prepare human review

Complete the investigation and prepare several concrete decisions before requesting the human's attention. Each proposal includes its reason, evidence, example, affected scope, consequences, and dependencies.

Present the prepared decisions in quick succession and record accept, reject, revise, or defer. Do not perform lengthy new investigations between short answers. Carry questions needing substantial new analysis into a later batch. Apply authorized decisions, check coherence, and return changed product meaning for review before adoption.

Keep human-facing documents easy to navigate: a short numbered introduction, numbered headings and subheadings, and short paragraphs beneath headings. Avoid repeating entire specifications in summaries, indexes, or review records.

## 5. Finish with evidence

Check affected links, indexes, section ownership, approval references, and the stated coverage. Run checks appropriate to the actual change; do not claim application behaviour was exercised from a documentation check. Report what changed, what was checked, and what remains proposed or unresolved.

## 6. Write the sub-issues of an implementation

When the approved Symbiospec changes need several implementation changes, write them as one parent issue with one sub-issue for each change, so that the result goes directly into the skill [issue_batch_workflow](../issue_batch_workflow/SKILL.md):

- Group the sub-issues by area, and order the groups by their dependencies. Write the groups and the order in the parent issue.
- Ask every open question during the human review of section 4, and write the answers in the parent issue and in the sub-issues. A sub-issue has no open question when the implementation starts.
- Link each sub-issue to the approved specifications that it implements.

## 7. Propose screens and navigation

For user interface structure derived from approved Symbiospec, use the separate [symbio_spec_to_ux draft](../symbio_spec_to_ux/SKILL.md). The draft proposes objects, relationships, calls to action, attributes, screens, and navigation for human review. The draft remains untested on a real project and does not authorize implementation.

## 8. Design references

The supporting references make this skill usable without network access. These issues provide design context rather than project-specific approval:

- [Symbiospec definition and structure](https://github.com/jeromeetienne/coding_agent_plugin/issues/10).
- [Symbiospec workflow guide](https://github.com/jeromeetienne/coding_agent_plugin/issues/11).
