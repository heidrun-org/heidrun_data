# AGENTS.md

The folder `testbed_folder/` is a place to try the skills of the repository `heidrun_data` with a coding agent. Start the coding agent in the folder `testbed_folder/`.

## Skills

The skills are in `.agents/skills/`. Each skill in `.agents/skills/` is a symbolic link to a skill in `packages/heidrun_data/skills/`, so a change to a skill in `packages/heidrun_data/skills/` is visible here at once.

- `heidrun-data`: answers a question about the history of a repository with the command line `heidrun_data`.

## Layer for Claude Code

- `CLAUDE.md` imports this file.
- `.claude/skills/` is a symbolic link to `.agents/skills/`.

## Database

- The database is `heidrun_data_example_database.sqlite` in the folder `testbed_folder/`. It holds the data of the repository `heidrun-org/heidrun_notebook`.
- Give `--database heidrun_data_example_database.sqlite` to every `heidrun_data` command.

## Outputs

- Put every artifact (image, chart, report, data file) in the folder `outputs/` of the folder `testbed_folder/`.

### Experiment folders and navigation

- Always propose an `index.html` as a single navigation page linking the pages and artifacts in an experiment folder.
- Give each experiment a separate folder inside `outputs/`. An experiment may contain multiple HTML pages, scripts, styles, images, and derived data files; a single self-contained file is not required.
- Keep `outputs/index.html` as the navigation page linking all experiments. Keep each experiment folder's `index.html` linked to the experiment's pages and artifacts, and update the navigation when files are added, renamed, or removed.
- Include an “Outputs navigation” back link in every generated HTML report. Use the correct relative path to `outputs/index.html`, including for reports inside experiment folders.

### Visualization formats

- **Static image:** useful for a fixed illustration, export, or sharing. A static image does not support hovering, filtering, zooming into the underlying data, or changing the displayed measure.
- **Interactive web page:** the preferred and most natural format for data exploration through AI chat. An HTML page can combine several graphs, hover details, selectors, filters, zoom, and different views of the same data. A dynamic web page can update the displayed information as the reader interacts. Choose interactions that help answer the exploration question.
- **3D visualization:** an experimental option for exploring relationships or spatial information when a third dimension has a clear purpose. The usefulness of 3D for this workflow remains unproven. Explain what the reader can learn from 3D before proposing 3D; do not use 3D as the default starting point.

### Automatic reload

- When generating an HTML page, explain that automatic reload is available and propose an address with automatic reload so the reader does not need to reload manually after saved changes.
- The existing local server is started from `testbed_folder/` with `python3 outputs/serve_outputs.py`. Its navigation page is `http://127.0.0.1:8765/index.html`.
- Pages opened through the local server check for saved HTML changes every two seconds and reload when the HTML changes. Pages opened directly as local files do not have this automatic reload mechanism.
- Clearly state whether automatic reload is running and provide the address with automatic reload when the server is running. Do not claim that direct-file pages reload automatically.

## Data sources

- All data used for exploration, calculations, reports, and visualizations in this folder must come through the `heidrun_data` command line.
- Do not collect data independently through Git commands, GitHub commands or APIs, external services, or direct reads of source logs. Use `heidrun_data` to query, read, initialize, or update the data instead.
- Derived datasets and calculations are allowed when their source records come through `heidrun_data`. State the source and calculation with each visualization.
- If `heidrun_data` cannot provide a record, report the missing data. Do not substitute another collection method.

## Communication

- When a generated image, chart, report, or HTML page is ready, explicitly announce completion and provide a clickable link with the exact filename. Apply this rule during voice conversations as well.
- Use descriptive artifact filenames that state the subject, measure, and date range where relevant.

- Clearly announce when work starts, when work finishes, and when a blocker prevents progress. Keep the user updated during ongoing work, including voice conversations.
