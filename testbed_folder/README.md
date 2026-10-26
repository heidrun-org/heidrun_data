# testbed_folder

The folder `testbed_folder/` is a place to try the skill `heidrun-data`. Start the command line of your coding agent in the folder `testbed_folder/`, so that the coding agent reads the skill `heidrun-data`, and then ask the coding agent questions that use the skill `heidrun-data`.

## How to start

```sh
cd testbed_folder
claude
```

Use `claude` for Claude Code. Any other coding agent that reads `AGENTS.md` and `.agents/skills/` also works.

## What the folder holds

- `AGENTS.md`: the instructions for any coding agent.
- `.agents/skills/heidrun-data`: a symbolic link to `packages/heidrun_data/skills/heidrun-data`.
- `.agents/skills/feature-status`: a symbolic link to `packages/heidrun_data/skills/feature-status`, the skill that writes a deep report on the status of one feature.
- `CLAUDE.md` and `.claude/skills`: the layer for Claude Code on top of `AGENTS.md` and `.agents/skills/`.
- `databases/`: the databases, one for each Heidrun workspace, named `<workspace name>.sqlite`. The databases are not in Git.
- `outputs/`: the images, the reports, and the web pages that the coding agent makes, in the namespace below.

## Namespace of the folder outputs

A Heidrun workspace has one database. The folder `outputs/` has one folder for each Heidrun workspace. Each workspace folder has one folder for each experiment, and an experiment is one visualization of the data of that workspace.

```
outputs/
  index.html
  serve_outputs.py
  workspace_<workspace name>/
    index.html
    experiment_<experiment name>/
      index.html
```

- `outputs/index.html` links the `index.html` of every workspace folder.
- `outputs/workspace_<workspace name>/index.html` links the `index.html` of every experiment folder of that workspace.
- `outputs/workspace_<workspace name>/experiment_<experiment name>/index.html` is the entry page of the experiment. The folder of the experiment also holds its scripts, its images, and its derived data files.
- The workspace name is the name of the database file without `.sqlite`. For example, the database `databases/heidrun_code.sqlite` belongs to the folder `outputs/workspace_heidrun_code/`.

The full rules are in `AGENTS.md`.

## See the outputs in a web browser

Start the local server from the folder `testbed_folder/`, then open `http://127.0.0.1:8765/index.html`. A page opened through the local server reloads by itself when the page changes.

```sh
python3 outputs/serve_outputs.py
```
