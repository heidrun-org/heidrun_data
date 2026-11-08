# Symbiospec workflows

## 0. Introduction

### 0.1. Initialize Symbiospec

Create the structure for new software or progressively establish a validated specification for existing software.

### 0.2. Update Symbiospec as the software changes

Keep affected specifications current during each authorized development task.

### 0.3. Realign Symbiospec when drift is detected

Compare the current specification with the software and relevant tests, then resolve differences within the user's authorization.

## 1. Initialize Symbiospec

### 1.1. New software

Read [format.md](format.md), repository instructions, and existing documentation. Create the agreed structure at `docs/symbio_spec/`, with folder contracts in the overviews and accurate navigation in the indexes. Start `decisions.md` and `coverage.md` with honest, empty initial records. Do not invent product concepts or approvals to fill the folders.

Add the repository instruction pointer described in the format reference during authorized setup. Then use Update as the first concepts and capabilities are developed. Product decisions already supplied by the human can populate the specification within their actual scope.

### 1.2. Existing software: slow growth

Start with a bounded, read-only inspection. Identify existing specifications and approvals before creating competing documents. If earlier specifications exist, preserve useful content and propose moves or splits incrementally. Do not treat an uncertain approval history as approval.

Slow growth means constructing a small, trusted foundation and expanding through repeated human-reviewed cycles. Prioritize the most evident, well-supported concepts rather than the largest features. A mistaken early concept can affect many later descriptions; small validated increments limit that propagation and let the human understand and control the process.

Each cycle follows the steps below. The steps apply to the selected increment, not to the whole application.

#### 1.2.1. Identify a few clear concepts

Use the source code, tests, existing documentation, relevant history, and permitted direct observation as evidence. Record relationships, confidence, and uncertainties. Inspect enough to understand the selected concepts without attempting an exhaustive reconstruction before the first useful review.

#### 1.2.2. Validate the initial glossary

Prepare names, definitions, relationships, evidence, and concrete examples for several major concepts. Use the prepared review method in the skill entry point. Correct misunderstandings and establish canonical definitions before relying on those definitions for authoritative related specifications. Investigate aliases without blindly replacing names.

#### 1.2.3. Document a small, coherent part

Prepare the relevant Behaviour, User Interface, and other applicable descriptions around the accepted concepts. Every cycle can cross documentation areas. Do not complete the whole Glossary before documenting any Behaviour, and do not require all six areas to receive content in every cycle.

Separate observed results from expected results. A test may encode a misunderstanding, so passing tests do not automatically approve the expected behaviour.

#### 1.2.4. Review a prepared batch

Finish the investigation and prepare the affected product decisions, examples, dependencies, and consequences before the review. The human can accept, reject, revise, or defer decisions in quick succession. Carry questions requiring substantial new investigation into a later batch rather than repeatedly interrupting the review with long waits.

#### 1.2.5. Correct and establish a trusted foundation

Apply authorized corrections to the specification, record human decisions, and verify that the documented part is coherent and understood. Update navigation and coverage. Keep known differences between approved expectations and actual software explicit; changing software requires authorization for that work.

#### 1.2.6. Expand and repeat

Select the next evident concepts or deepen existing descriptions. Preserve validated work and check every addition's relationships to the existing specification. Revisit an earlier approved decision explicitly if new evidence challenges the decision. Keep the next scope small enough for meaningful human review.

An approved baseline may cover only part of the software. State that coverage honestly. Update can maintain already established areas while initialization continues elsewhere. Do not claim that initialization verified every feature or every test.

## 2. Update Symbiospec as the software changes

Read the affected approved specifications before implementation. Use the user's development request to determine the authorized product change, and identify which concepts, behaviours, interface descriptions, styling conventions, platform requirements, or overview relationships are affected.

Update the corresponding Symbiospec content in the same development task. Keep unchanged product meaning unchanged, and maintain affected links and indexes. Technical refactoring with no product-level effect needs no artificial specification edit; say that no relevant specification change was found when useful.

Existing authorization applies. If the work exposes additional product decisions, prepare those decisions together for review. Apply authorized updates without asking again, and preserve unresolved proposals separately. An implementation mistake or unexpected test result does not authorize a changed product requirement.

Record meaningful decisions and coverage changes. Run checks appropriate to the actual implementation and documentation change. Summarize the resulting product difference, affected specification, verification performed, and remaining uncertainty.

## 3. Realign Symbiospec when drift is detected

Run this workflow when requested, or as part of an explicitly authorized recurring review. The skill itself does not schedule future work. A periodic check is useful even when nobody has reported drift.

### 3.1. Compare without modifying

Identify the approved references and an explicit scope. Compare the current specification with implementation paths, relevant test expectations, and permitted application observations. Record examined and unexamined areas. Read-only comparison does not permit unrequested code or specification corrections.

### 3.2. Report differences

Write the report under `docs/symbio_spec/reports/` when saving the report is authorized. Otherwise present the findings in the conversation. Check outdated descriptions, undocumented capabilities, conflicting requirements, implementation regressions, missing or contradictory test coverage, terminology, section ownership, and broken references.

For each finding, distinguish evidence from inference and confidence from severity. Include expected and observed results, affected references, recommended correction, and whether a new product decision is needed. A missing test is a coverage gap, not proof that the feature is broken.

### 3.3. Review proposed corrections

Prepare correction decisions in batches. Corrections may affect software, Symbiospec, tests, or a combination. Use existing authorization; request decisions only where needed. Defer findings requiring further investigation and return revised product meaning for human review.

### 3.4. Apply authorized corrections

Preserve approved intent while applying authorized changes. Do not rewrite the specification simply to match a regression, or reinitialize the entire structure to fix a local difference. Keep software compatibility and unrelated documentation intact.

### 3.5. Verify the result

Repeat the affected comparisons and appropriate implementation checks. Update the report, decisions, indexes, and coverage with resolved and unresolved findings. Report the actual scope verified; no difference found in one area does not prove that the entire software matches Symbiospec.
