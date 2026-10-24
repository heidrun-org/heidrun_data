# Experimentation log 1

Notes on what works and what does not work when exploring data through AI chat.

## 24 October 2026

### Static images generated with Python and Matplotlib

I tried images generated with Python and Matplotlib. The images felt flat and were not interactive, which limited data exploration.

### Standalone, self-contained HTML pages

I then tried standalone, self-contained HTML pages. HTML pages worked much, much better. The data looked better, and interaction made the data easier to explore.

HTML pages can support:

- Hovering over a column or another part of a graph to see the underlying values.
- Multiple graphs on the same page.
- Zooming into the data.
- Different interactions and different ways to visualize the information.

For this data exploration workflow, web pages are a good output format. The useful interactions should be chosen for each graph.

The later experiments confirmed that web pages are definitely better for this workflow. However, an experiment does not need to be packaged as a single, self-contained HTML file. An experiment can use multiple files when multiple files make the experiment easier to develop and explore.

### 3D visualization remains unproven

The usefulness of 3D visualization is still unproven. Looking at the 3D experiment, I do not yet know what to do with the 3D view or which insight the 3D view helps me find. Starting data exploration in 3D feels strange.

Interactive web pages have shown a clear benefit. The 3D experiment has not yet shown a clear benefit. Treat 3D as an experiment rather than the starting point for data exploration.

### Automatic reload

Automatic reload is useful. Provide a way for the displayed page to detect saved changes and reload automatically, so I do not have to reload the page after every update by the coding agent.

The current automatic reload mechanism works through the local server. A page opened directly as a local file does not have automatic reload. Make the address with automatic reload easy to find and use.

### Navigation and one folder per experiment

An `outputs/index.html` page that stays linked to all experiments is useful. Keep the navigation updated as experiments are added or changed. Each experiment page should provide an “Outputs navigation” back link.

Use a separate folder inside `outputs/` for each experiment. Each experiment folder should hold the files needed for that experiment, such as HTML pages, scripts, styles, and derived data. An experiment folder can have its own `index.html` as the entry page, linked from `outputs/index.html`.

There is no requirement to put an entire experiment into a single file.

### Explain the data source and calculation

Each graph should explain:

- The source of the data.
- How the graph was computed, including the records counted, filters, grouping, date range, time zone, and calculations where relevant.

Keep these explanations with the graph so the reader can understand where the values came from and how the values were produced.

### Use Heidrun Data as the data source

All data used for exploration, calculations, reports, and visualizations in this folder must come through the `heidrun_data` command line. Heidrun Data is specifically provided for this workflow.

During the discussion, the assistant incorrectly suggested collecting repository and AI-usage data separately, even though the existing calendar already used records supplied by Heidrun Data. This caused confusion about which data was available and where the data should come from.

The rule for future exploration is:

- Use `heidrun_data` to query, read, initialize, or update the data.
- Do not collect data independently through Git commands, GitHub commands or APIs, external services, or direct reads of source logs.
- Calculate derived measures only from records supplied through `heidrun_data`.
- If records are unavailable through `heidrun_data`, explain the missing data instead of substituting another collection method.

This requirement is also recorded in `AGENTS.md`.
