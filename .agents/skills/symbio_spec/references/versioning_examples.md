# Symbiospec versioning verification examples

## 1. Purpose and limits

For contributors checking the [versioning and migration procedure](versioning.md). Use disposable copies of specification files for these exercises. Only `1.0.0` is a published Symbiospec format. Exercise layouts A, B, and C are illustrative layouts, not additional published versions or proposals for future storage.

Include the six specification areas, two ordered decision records with sources, dates, scope and an unresolved condition, coverage, a glossary topic, a behaviour topic, and relative references. Compare file inventories, content, and references using the tools available in the receiving environment. These examples require no particular programming language or executable migration tool.

## 2. Adoption and detection

Begin with an existing unversioned folder. Report its effective format as `1.0.0` and propose adding the version record. Verify that preparing or declining adoption makes no changes. After adoption is authorized in the exercise, add only `format-version.md`; compare every pre-existing path and byte with the original inventory. Remove the record on a separate reverse-adoption pass and verify exact restoration.

Read the supported version record. Reject a missing component, a leading zero, a release suffix, duplicate version fields, and an empty field. Reject unknown `1.1.0` and `2.0.0` as unsupported without mutation. An unknown minor version is not automatically supported by the installed skill. An absent folder requires initialization; an absent record in an existing folder means unversioned data.

## 3. Consecutive migration and preservation

Exercise A to B moves the coverage file and updates its index reference. Exercise B to C moves the glossary topic and updates its index and incoming behaviour reference. For each step, take and verify a complete snapshot, write the migration record before changes, compare the complete resulting inventory, check moved file bytes and updated references, and compare all unaffected files byte for byte. Decision records must remain identical, preserving ordering, approval sources, affected references, dates and unresolved conditions.

Before completing each step, reverse the conversion on a separate copy and compare the recovered inventory and bytes with that step's snapshot. Check that the migration record continues to block normal work after a version-record replacement, and remove the migration record last. Do not present the changed exercise layouts as valid production `1.0.0` data or publish fictional versions to perform the exercise.

For the reverse-conversion limitation, add a field explicitly declared unrepresentable in the earlier exercise layout. Refuse reverse conversion and compare the whole inventory to prove that refusal discarded nothing. A real conversion must document the actual unrepresentable fields in its published instructions.

## 4. Interruption and recovery

Take a verified snapshot, write a migration record, and leave a partially overwritten decision file. Detection must block normal work. Preserve the interrupted state separately, restore the complete source snapshot while retaining the migration record, and compare every restored path and byte before removing the record. Also identify any unrelated edits before restoration; never overwrite those edits with a backup.

## 5. Verification record

Report the actual actions, tools, output, and limitations for each exercise. Separate successful adoption, rejected records, consecutive conversions, reverse-conversion limitations, and interruption recovery. Include the inventory comparison and reference checks supporting each result.

Inspect entry-point declarations, links, and retained definitions. File equality alone cannot establish preserved product meaning when a conversion changes content. A procedure exercise does not establish a real project migration or human acceptance.
