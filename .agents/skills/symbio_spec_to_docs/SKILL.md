---
name: symbio_spec_to_docs
description: Generate and update documentation inside a repository from its approved Symbiospec and implementation evidence, for configured audiences. Requires the symbio_spec skill and the project's Symbiospec data. Use to create documentation sets, review coverage, or update generated documentation after product changes.
---

# Symbiospec to documentation

Use the project's approved Symbiospec and implementation evidence to generate documentation inside the repository. This skill requires the installed skill `symbio_spec` and the project's Symbiospec data. Read `symbio_spec` and the relevant project data before generating documentation. If either dependency is unavailable, identify the missing dependency and stop generation. Initializing or correcting Symbiospec is a separate task through `symbio_spec`.

Keep reusable instructions independent of a particular application, documentation renderer or hosting service. Product information belongs to the project's Symbiospec; audience and editorial choices belong to the documentation configuration.

## Configuration

Each named documentation set has its own `config.md`, outside the skill folder, and its own destination folder inside the repository. A project may have several sets, such as user documentation and developer documentation. The caller supplies each configuration path; never search for a configuration, guess its location or silently choose an audience. Paths inside the configuration are relative to the repository root unless explicitly stated otherwise; output destinations must remain inside the repository.

- With The Rules of the Repo: the caller passes the path from the Configuration column of the matching row. Configuration ownership and approval follow that row. Keep each configuration with the other rule configurations, under the repository's configuration folder for this skill. Multiple sets can use separate subfolders and matching rows.
- Without The Rules of the Repo: the request or a section of `AGENTS.md` passes the configuration path. The configuration may live at any repository-chosen location outside this skill folder. The Rules of the Repo is optional.

Both callers supply the same values and run the same process. Read [the configuration reference](references/configuration.md) when preparing a configuration or registering documentation sets. Read the supplied configuration before writing. Required values are:

- Documentation name: the identity of this documentation set.
- Documentation type: for example user documentation or developer documentation.
- Audience: intended readers, their goals and assumed knowledge.
- Application: the product and the locations of implementation evidence.
- Symbiospec: specification, decision and coverage locations.
- Included topics: the scope to explain.
- Excluded topics: information that must stay out, even when accurate.
- User workflow: the entry point and supported way the audience uses the product.
- Output: destination folder and introduction page inside that folder.
- Presentation and publication: format or renderer, public destination and which files belong in published documentation.
- Review record: where source mapping, gaps, conflicts and verification results belong, separately from audience-facing pages.
- Update procedure: when to recheck the pages and how configuration changes are authorised.

An explicit `none` is valid where appropriate, for example no excluded topics or no publication. `none` cannot replace the audience, sources, output, or another value needed to generate and review the set. If a path is absent, unreadable or points inside this skill folder, or a required value is missing or unusable, identify the problem and stop generation for that set before changing its output. Validate all explicitly requested configurations before writing; reject identical or nested destination folders for different sets, and reject destinations that would overwrite Symbiospec, application sources, configuration or review records. Report ambiguous set selection rather than choosing a set silently. Changes of editorial scope need the authority stated in the configuration; an ordinary source update does not authorise a change of audience.

## Establish the scope

Use the supplied configuration to select the audience, sources and output. Follow the repository rules for changes. Read decision and coverage records before topic specifications: folder location or a general overview is not proof of approval or implementation.

Distinguish approved behaviour, unapproved proposals, implemented behaviour and behaviour observed in the running application. Check approval for the relevant decision, including later amendments. Existing guides and skills help locate evidence but do not override approved decisions or establish live behaviour.

Document a feature only when both approved Symbiospec and current implementation evidence support the feature. Leave approved but unimplemented features out and report the gaps. Leave implemented features missing from Symbiospec out and report the missing product information; document those features only after Symbiospec has been updated and approved. Do not repair Symbiospec silently during documentation generation.

## Write useful guidance

Explain what the product helps the reader accomplish, then give a useful workflow with prerequisites, practical examples and expected results. Preserve established product names and current interface labels. Explain necessary technical terms in ordinary words. Apply included and excluded topics before selecting instructions: accurate source information is not automatically relevant to the configured audience. Keep developer installation, repository paths and internal tools out of user documentation unless the configuration requires those details. Generate only the requested sets, in their separate destination folders.

Translate requirements into guidance rather than reproducing the specification's structure or implementation details.

For third-party connection setup, check current official vendor instructions and the application's actual supported authentication flow. Record the vendor source and review date in the source mapping. Do not infer phone support from desktop support or copy a vendor default that the application does not support. Keep source-grounded setup instructions distinct from an installation exercised in the actual client.

Inspect the implementation and relevant tests, then exercise practical instructions in the actual application when access permits. Report source inspection, executed tests and live checks separately. Never report an unexecuted test as successful. Lack of live access does not itself prove that an implemented feature is unavailable; record the verification limit without presenting live verification as completed.

When sources disagree, record the disagreement and affected instructions. Omit unsupported instructions or explain a useful current limitation. If a disagreement prevents accurate guidance, omit the affected passage and explain in the review record which evidence or decision is needed. Do not invent setup steps, permissions, screen labels or outcomes, or publish unresolved claims as available features.

## Ownership and updates

`symbio_spec_to_docs` owns the generated documentation in each configured destination folder and may rewrite generated passages during updates, including passages edited by people. Do not require detection of who edited each passage. Corrections belong in Symbiospec or the documentation configuration, followed by regeneration; do not maintain manual exceptions in generated pages.

When Symbiospec or the application changes, use the source mapping to find affected pages. Recheck approval and implementation, revise the guidance, and update coverage and unresolved findings. Preserve accurate content and unrelated generated pages. Remove or revise guidance that no longer has both specification and implementation support. If no mapping exists, establish a mapping for the affected scope first. Ownership of generated output does not authorise changing other documentation sets or unrelated files; identify existing content that is outside the requested generated set before replacing content.

## Deliver pages and a separate review record

Keep source mapping and verification details separate from the audience's main explanation. Follow repository rules for the review record's destination. Temporary evidence can remain in the conversation, issue or a temporary file when configured that way.

The review record includes:

- The configuration path, documentation name and type, application version or checkout, audience, reviewed scope and source locations, including relevant approval decisions.
- A mapping from each page section to approved sources and implementation evidence, with specific file or heading links where possible.
- Coverage of the requested topics, uncovered topics and reasons for omissions.
- Gaps and conflicts, their effect on the pages, and the evidence or decision needed to resolve them.
- Separate results for clarity review, source accuracy, application exercises, documentation build and deployed website checks. Explicitly identify checks not performed.

Review whether a reader in the configured audience can understand the purpose, prerequisites, action and expected result without reading the specification. Check names, links and examples. Follow the configured content review procedure; source and build checks alone do not establish human acceptance.

Apply the skill to one representative topic before expanding a new set. Improve the instructions using actual review findings and recheck the sample. Approval and implementation can progress at different speeds: check coverage and the application even when a specification is approved.

Publication is separate from writing. Use the configured format, renderer and deployment workflow only within the authorised scope; generation need not run while serving static pages. Before building around an unproven hosting assumption, prove the critical assumption with a small representative test in the real environment. When website publication is in scope, verify unsigned-in access, navigation, assets, direct page loads and narrow-screen presentation in a real browser, and check existing application routes and sign-in. Report publication separately from content review.

## Invocation

With The Rules of the Repo, register this skill for changes to each configured set and changes to approved Symbiospec or application behaviour covered by that set. Supply the configuration path in the matching row. Use source mapping to identify affected pages; unrelated product changes do not require rewriting documentation.

Without The Rules of the Repo, put this section in `AGENTS.md`, replacing the configuration placeholder with the repository's chosen path. Add a named entry for each set when several sets exist:

```markdown
## Symbiospec to documentation

Follow the skill [symbio_spec_to_docs](.agents/skills/symbio_spec_to_docs/SKILL.md) when creating, reviewing or updating the configured documentation, or changing approved Symbiospec or application behaviour covered by that documentation. The skill requires the installed skill symbio_spec and this project's Symbiospec data.

- <documentation name> configuration: <path of that documentation set's config.md>
```

A direct request can also supply the configuration path. No repository-specific path is a default. When no caller supplies a path, report “symbio_spec_to_docs has no configuration path”, show the section above, and stop generation. Configuration setup can be requested separately; never generate pages from an incomplete configuration.
