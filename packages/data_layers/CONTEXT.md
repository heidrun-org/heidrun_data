# Directory Context: `/packages/data_layers`

## Purpose
Independent Rust libraries and command line tools that read source data into SQLite.

## Key Exports & Entry Points
- `data_layer_code_hosting/`: see its CONTEXT.md for its interface and responsibilities.
- `data_layer_coding_agents/`: see its CONTEXT.md for its interface and responsibilities.
- `data_layer_source_control/`: see its CONTEXT.md for its interface and responsibilities.
- `data_layer_user_activity/`: see its CONTEXT.md for its interface and responsibilities.

## Rules
- No data layer package imports another data layer package or heidrun_data; the packages share only the SQLite file.

## Background
- https://github.com/heidrun-org/heidrun_data/issues/30
