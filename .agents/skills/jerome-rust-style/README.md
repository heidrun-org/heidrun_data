# jerome-rust-style

The skill `jerome-rust-style` gives a coding agent the first draft of Jérôme Étienne’s personal Rust coding style. These rules are his personal preferences, not a general Rust standard.

## Purpose

Jérôme Étienne writes TypeScript, JavaScript, and Rust. The skill `jerome-rust-style` brings his personal style to Rust, so that his projects read in the same way in each language, and so that he does not correct the same points again and again in the Rust code that a coding agent writes.

The draft takes from his TypeScript and JavaScript style only the rules that clearly transfer to Rust, and the adaptations that he explicitly approves. The most important rule is clear, explicit, and complete names. For Jérôme Étienne, this rule is far more important than casing.

## The main rules

- Names are clear, explicit, and complete.
- No `snake_case` in Rust identifiers, file names, or folder names.
- `camelCase` for names other than types and enum variants, and `PascalCase` for types and enum variants. This rule overrides the usual Rust naming guidance, and the coding agent never changes a name to satisfy a lint that disagrees.
- The full rules cover priority, control flow, naming, documentation, formatting, comments, code organization, and section separators.

## The adaptation review

The adaptation review records the decision for each rule of the source style, and the questions that still need a decision from Jérôme Étienne. The adaptation review is not a list of style instructions: the coding agent reads the adaptation review when the coding agent discusses or extends the draft, and asks Jérôme Étienne before the coding agent adopts an uncertain adaptation.

## When the coding agent uses the skill

- The coding agent creates or edits a Rust source file in his personal style, or in a project that adopts his conventions.

## Configuration

The skill `jerome-rust-style` needs no configuration.

## Install

```bash
npx skills add jeromeetienne/coding_agent_plugin --skill jerome-rust-style
```

## Files

- [SKILL.md](SKILL.md): the instructions for the coding agent.
- [references/rust-style.md](references/rust-style.md): the active Rust rules.
- [references/adaptation-review.md](references/adaptation-review.md): the decisions for each rule, and the open questions.
