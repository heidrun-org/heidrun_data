# Symbiospec format versioning and migration

## 0. Introduction

### 0.1. Identify the format

Use one Markdown record for the whole folder and one retained definition per published version.

### 0.2. Check compatibility

Detect unversioned data, unsupported versions, malformed records, and interrupted migrations before normal work.

### 0.3. Convert and recover

Apply authorized consecutive migrations with preservation checks, verified completion, and recovery evidence.

## 1. Version record and definitions

One version covers the complete `docs/symbio_spec/` folder: structure, file formats, and conventions. Decision storage has no separate version. The format version is independent of the installed skill's release version.

Store the version at `docs/symbio_spec/format-version.md`:

```markdown
# Symbiospec format version

- Format version: 1.0.0
```

Apply the receiving repository's document header conventions when required. The title must be `Symbiospec format version`. Require exactly one field line of the form `- Format version: MAJOR.MINOR.PATCH`, outside code blocks. Each component is a non-negative decimal integer with no leading zeros except `0`. Accept published versions only; release suffixes and build metadata are not used. Missing, duplicate, conflicting, or invalid fields in an existing record are malformed, not an unversioned folder. An unreadable record is an error, not an absent record. Dates and other document metadata do not approve product content.

The [format registry](format.md) lists published versions in transition order and links one complete reference per version. Each future reference defines the entire format and links its forward conversion from the preceding published version, reverse conversion, limitations, and verification. Definitions and migration instructions must be available in the installed skill without network access. Never invent an unpublished definition or migration path.

Use Semantic Versioning, written `MAJOR.MINOR.PATCH`:

| Component | Meaning for Symbiospec |
| --- | --- |
| Major | An incompatible change requiring migration, such as changing required locations or replacing a storage structure. |
| Minor | A compatible addition, such as an optional file. Every previously valid folder remains valid without adding the optional content. |
| Patch | A correction or clarification that changes neither folder validity nor interpretation of existing content. |

A new requirement that invalidates an existing valid folder requires a major version. Retain published definitions; publish corrected definitions under a new patch version. A compatible transition may change only the version record; say explicitly when no content conversion is needed.

## 2. Check before normal work

Every Symbiospec skill declares its expected format and supported formats in its entry point and follows this procedure, including skills that only read specifications. Currently `symbio_spec`, `symbio_spec_to_docs`, and `symbio_spec_to_ux` expect and support `1.0.0`, including the unversioned equivalent. New releases update these declarations together with the registry and definitions.

At the beginning of setup and before any normal initialization, update, audit, Realignment, documentation generation, or interface proposal:

1. Read repository instructions. Check for `docs/symbio_spec/.format-migration.md` before consuming specification content. If present or unreadable, stop normal work and report an incomplete migration. Read only what is needed to diagnose or recover the migration under section 5.
2. If the Symbiospec folder does not exist, report that initialization is needed; create the expected format and version record only within authorized initialization. A read-only request does not authorize initialization.
3. If the folder exists but `format-version.md` is absent, report `unversioned (effective format 1.0.0)` and follow section 3. Do not require an extra format-recognition investigation to assign this version.
4. Otherwise parse the record using section 1. Stop on a malformed or unreadable record without modifying project data. Report the problem and the expected format; do not replace the record with a guess.
5. Compare the recorded version with the invoking skill's declared supported formats and the installed registry. Proceed only for a supported published format, using that format's definition. A different number alone does not require migration: future skills may explicitly support compatible versions. Never infer support for an unknown version merely from a matching major number. An older skill must stop on a newer major version.
6. For an unsupported version, report the project version, expected version, and reason. Propose an available migration path before normal work; if no reliable path exists, explain the missing definition or conversion and leave data unchanged. Do not fall back to an older installed format silently.

Installation that only copies skill files performs no project mutation. Run this check on first project use. Companion skills use their actual installed `symbio_spec` location; if its definitions or shared procedure are unavailable, stop rather than proceeding with another format.

## 3. Unversioned adoption

Explain that the existing unversioned format is `1.0.0` and propose adding the Markdown record. Read-only work may use the unversioned equivalent without writing metadata. For a writing workflow, establish the record before normal specification changes; use existing authorization for adoption, otherwise obtain that authorization. Declined adoption leaves all files unchanged and permits only supported read-only work.

Inventory every existing file and its bytes, including decision history, approval evidence, coverage, indexes, and any local changes. Add only `format-version.md`, following document metadata conventions. Verify that every pre-existing path and its bytes are unchanged and that the new record parses as supported `1.0.0`. No approval of product meaning or completeness follows from adoption.

This metadata-only adoption deliberately does not edit an existing index. During subsequent authorized normal maintenance, include the version record in navigation under the ordinary format rules. New initialization includes the record in its initial index. Removing the record reverses adoption only while the data still uses `1.0.0`, with the same unchanged-file verification; removing a record from a later format is never a migration back to version 1.

## 4. Prepare and apply migration

A format mismatch is not authorization to convert data. Use existing migration authorization; otherwise present the source, target, ordered steps, affected files and references, preservation checks, reverse limitations, and recovery plan for approval. If declined or no reliable path is available, leave the data unchanged and explain why normal work cannot proceed.

Follow the published transitions consecutively in either direction. For example, reaching a third published format from the first requires the first-to-second step and then the second-to-third step, each verified separately. Do not skip intermediate definitions. The first publication has no earlier version to convert; unversioned adoption is section 3.

For each step:

1. Read both full format definitions and the specific forward or reverse instructions. Identify the complete input and output file inventory, moved files, updated references (including known references outside the folder), and fields requiring preservation. Preserve ordering, scope, dates, sources, approval evidence, unresolved conditions, and the distinction between proposal and approval. Report external references that cannot be updated or checked.
2. Stop competing writers and retain unrelated local changes. Take a complete restorable snapshot of the folder outside the Symbiospec folder, plus any affected external files, and verify the snapshot against the original paths and bytes. Do not rely on a clean Git state or committed content as the only backup. Retain a separate verified snapshot for each step.
3. Before changing any input, create `.format-migration.md` in the Symbiospec folder. Record source and target versions, direction, the published conversion instructions, backup location, original inventory and checksums, affected external paths, and verification needed. Do not include this temporary administrative record as product specification content. If another record already exists, stop for recovery. If this record cannot be written reliably, do not begin conversion.
4. Apply only the defined changes. Keep the old version record until verification succeeds. Use temporary output files where useful and do not discard original records during conversion. Do not leave two competing authoritative histories in a completed format.
5. Verify the whole folder against the target definition, the complete input/output mapping, and the preservation requirements. Check for omissions, duplicates, changed meaning, broken links, lost approvals, and unrelated changes. Compare untouched files byte for byte. For a reversible conversion, exercise the reverse conversion on a separate copy and compare the recovered data with the source snapshot. Stop on any failure; the migration record continues to block normal work.
6. After verification, prepare the target version record in a temporary file on the same filesystem and replace `format-version.md` with a single rename. Verify the saved version and final folder again. Remove temporary outputs and `.format-migration.md` only after all checks succeed. A failure or interruption before removal still blocks normal work, even if the version record already names the target.
7. Report the completed step, actual checks and output, unchanged content, and limitations. Keep recovery evidence available until completion is accepted. Start the next step only after this step is complete.

A reverse conversion is permitted only where the earlier format can represent the data. If conversion would lose information, identify the exact affected data and stop the reverse conversion unchanged. Do not silently discard data or invent a lossless path. Obtaining a newer compatible skill or retaining the current format may be necessary.

## 5. Interrupted migration and recovery

The presence of `.format-migration.md` is the interruption signal, regardless of the version record's value. A malformed migration record also blocks work. Never clear the signal merely because some output files or the target version exist.

Read the migration record, source snapshot, current files, and conversion instructions. Preserve the interrupted state separately. Identify any edits made since conversion began; never overwrite unrelated edits with a backup. If the state or preservation cannot be established, stop and explain what is needed.

Within recovery authorization, either resume the documented step and run all target verification, or restore the complete source snapshot and affected external files. Verify restoration against the source inventory and bytes, including the source version record or its original absence. Remove the migration record only after verified completion or restoration. Report the outcome before normal work or another migration starts.

See [worked verification examples](versioning_examples.md) for adoption, rejected records, sequential conversions, reverse limitations, and interruption recovery. The examples are isolated exercises, not additional published formats or a migration tool.
