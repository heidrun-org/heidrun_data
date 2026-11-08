# Initialize and update

- Created: 8 November 2026
- Last updated: 8 November 2026
- Status: Imported existing specification; approval history not independently verified
- Related framing: [Symbiospec](../README.md)

## 0. Introduction

This document imports the synchronization mode definitions from the former agent glossary.

## 1. Initialize and update

The two modes of a data layer package. The mode initialize reads every fact of the source since the beginning. The mode update reads only the facts that changed since the last read. Each mode can run again and again, and never writes a row two times.

## 2. Import evidence

Imported at the developer’s request on 8 November 2026 from docs/agents_rules/glossary/data_layer.md. This import preserves the existing description; implementation and tests were not compared. See the [data layer glossary](../glossary/data_layer.md) for the related concepts.
