# Initialize Symbiospec

Before setup, follow [version detection and migration](versioning.md). Existing unversioned folders use format `1.0.0`; establish the record under the adoption rules without changing existing content. Unsupported formats or an incomplete migration must be resolved before initialization continues.

## 1. New software

Read [format.md](format.md), repository instructions, and existing documentation. Create the agreed structure at `docs/symbio_spec/`, including `format-version.md` with version `1.0.0`, folder contracts in the overviews, and accurate navigation in the indexes. Include the version record in the initial root index. Start `decisions.md` and `coverage.md` with honest, empty initial records. Do not invent product concepts or approvals to fill the folders.

Add the repository instruction pointer described in the format reference during authorized setup. Then use Update as the first concepts and capabilities are developed. Product decisions already supplied by the human can populate the specification within their actual scope.

## 2. Existing software: slow growth

Start with a bounded, read-only inspection. Identify existing specifications and approvals before creating competing documents. If earlier specifications exist, preserve useful content and propose moves or splits incrementally. Do not treat an uncertain approval history as approval.

Slow growth means constructing a small, trusted foundation and expanding through repeated human-reviewed cycles. Prioritize the most evident, well-supported concepts rather than the largest features. A mistaken early concept can affect many later descriptions; small validated increments limit that propagation and let the human understand and control the process.

Each cycle follows the steps below. The steps apply to the selected increment, not to the whole application.

### 2.1. Identify a few clear concepts

Use the source code, tests, existing documentation, relevant history, and permitted direct observation as evidence. Record relationships, confidence, and uncertainties. Inspect enough to understand the selected concepts without attempting an exhaustive reconstruction before the first useful review.

### 2.2. Validate the initial glossary

Prepare names, definitions, relationships, evidence, and concrete examples for several major concepts. Use the prepared review method in the skill entry point. Correct misunderstandings and establish canonical definitions before relying on those definitions for authoritative related specifications. Investigate aliases without blindly replacing names.

### 2.3. Document a small, coherent part

Prepare the relevant Behaviour, User Interface, and other applicable descriptions around the accepted concepts. Every cycle can cross documentation areas. Do not complete the whole Glossary before documenting any Behaviour, and do not require all six areas to receive content in every cycle.

Separate observed results from expected results. A test may encode a misunderstanding, so passing tests do not automatically approve the expected behaviour.

### 2.4. Review a prepared batch

Finish the investigation and prepare the affected product decisions, examples, dependencies, and consequences before the review. The human can accept, reject, revise, or defer decisions in quick succession. Carry questions requiring substantial new investigation into a later batch rather than repeatedly interrupting the review with long waits.

### 2.5. Correct and establish a trusted foundation

Apply authorized corrections to the specification, record human decisions, and verify that the documented part is coherent and understood. Update navigation and coverage. Keep known differences between approved expectations and actual software explicit; changing software requires authorization for that work.

### 2.6. Expand and repeat

Select the next evident concepts or deepen existing descriptions. Preserve validated work and check every addition's relationships to the existing specification. Revisit an earlier approved decision explicitly if new evidence challenges the decision. Keep the next scope small enough for meaningful human review.

An approved baseline may cover only part of the software. State that coverage honestly. Update can maintain already established areas while initialization continues elsewhere. Do not claim that initialization verified every feature or every test.
