# AGENTS.md

The folder `testbed_folder/` is a place to try the skills of the repository `heidrun_data` with a coding agent. Start the coding agent in the folder `testbed_folder/`.

## Skills

The skills are in `.agents/skills/`. Each skill in `.agents/skills/` is a symbolic link to a skill in `packages/heidrun_data/skills/`, so a change to a skill in `packages/heidrun_data/skills/` is visible here at once.

- `heidrun-data`: answers a question about the history of a repository with the command line `heidrun_data`.
- `feature-status`: writes a deep report on the status of one feature: what the feature is, its purpose, its current behavior, its history, and its open work. It needs the skill `heidrun-data`.

## Layer for Claude Code

- `CLAUDE.md` imports this file.
- `.claude/skills/` is a symbolic link to `.agents/skills/`.

## Workspaces and databases

- A Heidrun workspace has exactly one database. The database is `databases/<workspace name>.sqlite` in the folder `testbed_folder/`.
- The workspace name is the name of the database file without `.sqlite`.
- Give `--database databases/<workspace name>.sqlite` to every `heidrun_data` command.
- Never put a database in the folder `outputs/`.
- The existing workspaces are:
  - `heidrun_data_example_database`: the data of the repository `heidrun-org/heidrun_notebook`.
  - `heidrun_code`: the data of the repository `heidrun-org/heidrun_code`.
  - `heidrun_data_commits`: the data of the repository `heidrun-org/heidrun_data`.

## Outputs

- Put every artifact (image, chart, report, data file, script) in the folder `outputs/` of the folder `testbed_folder/`, in the folder of its experiment.

### Namespace of the folder outputs

```
outputs/
  index.html
  serve_outputs.py
  workspace_<workspace name>/
    index.html
    experiment_<experiment name>/
      index.html
```

- `outputs/workspace_<workspace name>/` is the folder of one Heidrun workspace. Create it when the first experiment of the workspace starts.
- `outputs/workspace_<workspace name>/experiment_<experiment name>/` is the folder of one visualization experiment. Write the experiment name in `snake_case`, and make the name state the subject and the measure.
- `outputs/index.html` links the `index.html` of every workspace folder.
- `outputs/workspace_<workspace name>/index.html` links the `index.html` of every experiment folder of that workspace.
- `outputs/workspace_<workspace name>/experiment_<experiment name>/index.html` is the entry page of the experiment. When the experiment has more than one page, the entry page links the other pages and artifacts.
- An experiment may contain multiple HTML pages, scripts, styles, images, and derived data files; a single self-contained file is not required.
- An experiment that reads the databases of more than one workspace goes in the folder of the workspace of the first database it reads. The entry page names every database it reads.

### Navigation

- Update the `index.html` pages when a workspace folder, an experiment folder, or a file is added, renamed, or removed.
- Every generated HTML page has a back link to the `index.html` of its parent folder:
  - The entry page of an experiment links `../index.html` with the text “Workspace navigation”.
  - The `index.html` of a workspace links `../index.html` with the text “Outputs navigation”.

### Visualization formats

- **Static image:** useful for a fixed illustration, export, or sharing. A static image does not support hovering, filtering, zooming into the underlying data, or changing the displayed measure.
- **Interactive web page:** the preferred and most natural format for data exploration through AI chat. An HTML page can combine several graphs, hover details, selectors, filters, zoom, and different views of the same data. A dynamic web page can update the displayed information as the reader interacts. Choose interactions that help answer the exploration question.
- **3D visualization:** an experimental option for exploring relationships or spatial information when a third dimension has a clear purpose. The usefulness of 3D for this workflow remains unproven. Explain what the reader can learn from 3D before proposing 3D; do not use 3D as the default starting point.

### Automatic reload

- When generating an HTML page, explain that automatic reload is available and propose an address with automatic reload so the reader does not need to reload manually after saved changes.
- The existing local server is started from `testbed_folder/` with `python3 outputs/serve_outputs.py`. Its navigation page is `http://127.0.0.1:8765/index.html`. The address of an experiment is `http://127.0.0.1:8765/workspace_<workspace name>/experiment_<experiment name>/index.html`.
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
