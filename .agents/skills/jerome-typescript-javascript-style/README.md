# jerome-typescript-javascript-style

The skill `jerome-typescript-javascript-style` gives a coding agent Jérôme Étienne’s personal TypeScript and JavaScript coding style. These rules are his personal preferences, not a general TypeScript or JavaScript standard.

## Purpose

A coding agent does not know the preferences of a developer. Without this skill, the coding agent writes code in a general style, and Jérôme Étienne must correct the same points again and again. The skill `jerome-typescript-javascript-style` gives the coding agent his full rules, so that the code that the coding agent writes looks like the code that he writes.

The full rules are inside the skill. The skill does not need access to his Claude Code user configuration, so the skill works in every project and for every coding agent that installs the skill.

## What the rules cover

- Conditionals, for example `=== null` instead of `!varName`.
- Control flow, for example braces around the body of every `if` and every loop.
- Types, for example `type` aliases, Zod schemas, and `unknown` instead of `any`.
- Documentation, for example JSDoc on every exported type, with `@param` and `@returns`.
- Naming, for example `snake_case` file names, and a variable named after its class.
- Formatting, for example tab indentation, single quotes, and semicolons.
- HTML construction, with one template literal marked with `/* html */`.
- Code organization, for example one static class for each file, named after the file.
- Section separators, with lines of 79 `/` characters.
- Standalone JavaScript scripts.

## When the coding agent uses the skill

- The coding agent creates or edits a TypeScript, TSX, JavaScript, JSX, MJS, or CJS file in his personal style, or in a project that adopts his conventions.

## Configuration

The skill `jerome-typescript-javascript-style` needs no configuration. A change to the rules needs the explicit instructions of Jérôme Étienne.

## Install

```bash
npx skills add jeromeetienne/coding_agent_plugin --skill jerome-typescript-javascript-style
```

## Files

- [SKILL.md](SKILL.md): the instructions for the coding agent.
- [references/typescript-javascript-style.md](references/typescript-javascript-style.md): the full rules.
