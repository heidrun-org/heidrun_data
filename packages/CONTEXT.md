# Directory Context: `/packages`

## Purpose
Holds the product packages and developer tools of Heidrun Data, grouped by responsibility.

## Key Exports & Entry Points
- `data_layers/`: independent packages that read source data into SQLite; see its CONTEXT.md.
- `apps/`: the combined command line and library; see its CONTEXT.md.
- `dev_tools/`: developer-only checks; see its CONTEXT.md.

## Rules
- Every package belongs in data_layers, apps, or dev_tools; no package sits directly here.
- Product packages never depend on dev_tools.

## Background
- https://github.com/heidrun-org/heidrun_data/issues/30
