# Product Positioning

- Created: 24 October 2026
- Last updated: 24 October 2026
- Status: Working product-positioning proposal
- Related framing: [Heidrun Data repository](../../README.md)
- Related issue: [Heidrun Data — code understanding, historical intelligence and active optimization](https://github.com/heidrun-org/heidrun_notebook/issues/169)

## Working product name

**Heidrun Software Intelligence**

This name is the preferred working name for the product described here. “Software” covers the product's focus on the software system itself: its development history, code structure, and behavior when it runs. “Intelligence” signals that the product connects these sources to answer useful questions and support improvement.

The name remains a proposal until it is explicitly adopted as the product name.

## Preferred slogan

> **Understand your software. Improve it with evidence.**

The two sentences express the product's two connected goals:

- **Understand your software:** connect its development history, code structure, and the team's recorded reasoning.
- **Improve it with evidence:** use runtime profiles, tests, and comparable performance measurements to assess changes.

The phrase “with evidence” is central to the message. Explanations should link to their historical sources, and improvement claims should be supported by measurements and validation. The slogan does not promise that every question will have a complete answer or that every optimization will succeed.

## One-sentence description

**Heidrun Software Intelligence connects software history, code structure, and runtime evidence to help teams understand existing systems and improve them with confidence.**

## Product story

Software knowledge is spread across code, Git history, GitHub collaboration, coding-agent conversations, and performance experiments. Heidrun Software Intelligence brings these layers together:

1. **Development history** records what changed, what people discussed, and which decisions or attempts were documented.
2. **Static code analysis** derives a structural view of the code, including dependencies and call relationships, without executing the program.
3. **Active runtime analysis** profiles the running software, tests proposed changes, and compares performance measurements.

Together, these layers can help a developer understand why the software is the way it is, see how parts relate, and evaluate changes using evidence. [Codespine](https://github.com/jeromeetienne/codespine) performs the active optimization loop near the development environment; Heidrun Data keeps the resulting experiment records so the team can use them later.

## Message boundaries

- Historical explanations should distinguish recorded reasons from assumptions and link to their sources.
- Static code analysis describes relationships in the analyzed code; it does not prove every runtime effect.
- Performance claims should state their measurement conditions and should not be generalized from one run without support.
- The product supports engineering judgment; the slogan does not promise automatic improvement in every case.

## Naming alternatives considered

- **Heidrun Engineering Intelligence:** sounds more organizational and corporate, but may suggest team productivity or delivery analytics rather than intelligence about the software system.
- **Heidrun Code Intelligence:** is direct, but “code” can sound limited to source files and may not convey history or runtime performance.

**Heidrun Software Intelligence** is preferred because it covers the code, its history, and its observed behavior while remaining understandable as a product name.
