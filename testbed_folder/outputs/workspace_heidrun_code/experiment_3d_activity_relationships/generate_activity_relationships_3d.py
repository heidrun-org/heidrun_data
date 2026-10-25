"""Package the heidrun_data-derived daily dataset and Three.js into one HTML page."""
from pathlib import Path
from html import escape
import base64
import json

ROOT = Path(__file__).resolve().parent
CALENDAR_EXPERIMENT = 'experiment_daily_activity_metrics'
SOURCE = 'heidrun_code_heidrun_notebook_heidrun_data_daily_activity_metrics_2025-10-24_to_2026-10-23.json'
data = json.loads((ROOT.parent / CALENDAR_EXPERIMENT / SOURCE).read_text())

def module_url(source):
    return 'data:text/javascript;base64,' + base64.b64encode(source.encode()).decode()

three_url = module_url((ROOT / 'three_0_170_0.module.js').read_text())
controls = (ROOT / 'three_0_170_0_orbit_controls.js').read_text().replace("from 'three'", f"from '{three_url}'")
script = (ROOT / 'activity_relationships_3d.js').read_text().replace('__THREE__', three_url).replace('__CONTROLS__', module_url(controls))
license_text = (ROOT / 'three_0_170_0_LICENSE.txt').read_text()
controls_html = []
for axis, default in [('x', 'tokens'), ('y', 'cost'), ('z', 'lines')]:
    options = ''.join(f'<option value="{key}"{" selected" if key == default else ""}>{escape(value["label"])}</option>' for key, value in data['metrics'].items())
    controls_html.append(f'<label>{axis.upper()} axis<select id="{axis}-axis">{options}</select></label>')
filters = ''.join(f'<label class="repository"><input id="show-{i}" data-repository="{i}" type="checkbox" checked><span style="color:{color}">●</span> {r["name"]}</label>' for i, (r, color) in enumerate(zip(data['repositories'], ['#ff6b76', '#64b5ff', '#edc56b'])))
rows = []
for repository in data['repositories']:
    for day, values in repository['daily'].items():
        if not any((values[metric] or 0) > 0 for metric in ['commits', 'pullRequests', 'tokens']):
            continue
        cells = [repository['name'], day]
        for metric in data['metrics']:
            value = values[metric]
            label = 'Unavailable' if value is None else f'{value:,.2f}' if metric == 'cost' else f'{value:,}'
            if metric == 'cost' and values['unpricedRows'] > 0 and value is not None:
                label += ' (partial estimate)'
            cells.append(label)
        rows.append('<tr>' + ''.join(f'<td>{escape(cell)}</td>' for cell in cells) + '</tr>')
notes = ''.join(f'<li><strong>{escape(value["label"])}:</strong> {escape(value["description"])}</li>' for value in data['metrics'].values())
sources = ''.join(f'<li><strong>{r["name"]}:</strong> <code>{r["database"]}</code><br>' + '<br>'.join(escape(r['coverage'][metric]) for metric in ['commits', 'pullRequests', 'tokens', 'cost']) + '</li>' for r in data['repositories'])
embedded = json.dumps(data).replace('<', '\\u003c')
html = f'''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Heidrun Code, Heidrun Notebook, and Heidrun Data · 3D daily activity · 24 October 2025–23 October 2026</title>
<style>
:root{{color-scheme:dark;font-family:system-ui,sans-serif;background:#0d1117;color:#e6edf3}}*{{box-sizing:border-box}}body{{max-width:1440px;margin:36px auto;padding:0 24px;line-height:1.6}}a{{color:#79c0ff}}h1{{font-size:clamp(25px,3vw,38px);line-height:1.2;margin-bottom:12px}}.muted,#status{{color:#9aa7b9}}.controls{{display:flex;flex-wrap:wrap;gap:18px;padding:20px;border:1px solid #303b4e;border-radius:12px;background:#111827}}label{{display:flex;flex-direction:column;font-size:13px;gap:4px}}select,input[type=date],button{{font:inherit;background:#192334;color:#edf3ff;border:1px solid #45536b;border-radius:6px;padding:8px}}button{{cursor:pointer;align-self:end}}.repositories{{display:flex;flex-wrap:wrap;gap:20px;margin:18px 0}}.repository{{flex-direction:row;align-items:center;gap:7px;font-size:15px}}.plot{{display:grid;grid-template-columns:minmax(0,1fr) 280px;gap:16px}}#viewport{{height:570px;min-width:0;border:1px solid #303b4e;border-radius:12px;overflow:hidden;touch-action:none}}canvas{{display:block}}aside{{padding:20px;background:#111827;border:1px solid #303b4e;border-radius:12px}}#details{{white-space:pre-line;font-size:14px}}details{{border:1px solid #303b4e;border-radius:10px;padding:18px;margin:24px 0}}summary{{cursor:pointer;font-weight:600}}.table-scroll{{overflow:auto;max-height:540px}}table{{border-collapse:collapse;width:100%;font-size:13px}}th,td{{padding:10px;text-align:right;border-bottom:1px solid #303b4e;white-space:nowrap}}th:first-child,td:first-child{{text-align:left}}th{{position:sticky;top:0;background:#172133}}li{{margin:12px 0}}pre{{white-space:pre-wrap;font-size:12px}}@media(max-width:850px){{.plot{{grid-template-columns:1fr}}#viewport{{height:440px}}body{{padding:0 16px}}}}
</style></head><body><main>
<a href="../index.html">← Workspace navigation</a><h1>Daily activity in 3D</h1>
<p class="muted">Heidrun Code · Heidrun Notebook · Heidrun Data<br>24 October 2025 – 23 October 2026 · Europe/Paris</p>
<p>Explore how AI usage, estimated cost, and code changes relate. Each point represents one active day in one repository. Choose different measures for the three axes to compare other relationships.</p>
<div class="controls">{''.join(controls_html)}<label>Axis scale<select id="scale"><option value="linear">Linear</option><option value="log">Logarithmic: log(1 + value)</option></select></label><label>From<input id="date-from" type="date" value="{data['start']}" min="{data['start']}" max="{data['end']}"></label><label>Through<input id="date-to" type="date" value="{data['end']}" min="{data['start']}" max="{data['end']}"></label><button id="reset" type="button">Reset view</button></div>
<div class="repositories">{filters}</div>
<p id="status" role="status">Starting the 3D view. If the view does not load, the data table below remains available.</p>
<div class="plot"><div id="viewport" role="img" aria-label="Interactive 3D plot of daily repository activity"></div><aside><strong>Explore the points</strong><p>Drag to rotate. Scroll or pinch to zoom. Drag with the right mouse button to move the view.</p><p id="details">Hover over a point to see its date and all five measures.</p><p class="muted">Axes use different units. Correlation does not establish productivity or causation. Token usage and dollar cost are related by model prices.</p></aside></div>
<noscript><p>Enable JavaScript for the 3D view. The table below contains the daily records.</p></noscript>
<details open><summary>Daily values · accessible table</summary><p>The table initially includes all recorded active days. When the 3D view starts, the table follows the repository, date, and axis selections. No missing values are replaced with zero.</p><div class="table-scroll"><table><thead><tr><th>Repository</th><th>Date</th><th>Commits</th><th>Pull requests opened</th><th>Lines changed</th><th>AI tokens</th><th>Estimated AI cost (US dollars)</th></tr></thead><tbody id="daily-records">{''.join(rows)}</tbody></table></div></details>
<details><summary>Data sources, calculations, and limitations</summary><p>Every activity record comes through <code>heidrun_data</code>. This page uses the daily dataset already computed for the calendar: <a href="../{CALENDAR_EXPERIMENT}/{SOURCE}">{SOURCE}</a>. No activity data is fetched from another source by this page.</p><ul>{notes}</ul><p>Dates use Europe/Paris time. Days with no recorded commits, pull requests, or tokens are omitted. A day is excluded when any selected measure is unavailable, or when selected dollar cost has an unknown model price. Missing data is not zero. Zero means no activity recorded in the available snapshot, not proof that no activity occurred. Later activity and undated token usage are excluded. The last day may be incomplete.</p><p>All selected repositories share each axis scale. Linear axes start at zero; logarithmic axes use log(1 + value) to preserve zero. Tick labels always show original units. Coincident points may overlap; rotate or filter repositories to explore them. Lines changed means additions plus deletions in non-merge commits.</p><ul>{sources}</ul></details>
<details><summary>Three.js licence</summary><p>Three.js version 0.170.0 and OrbitControls are bundled in this page for offline use. <a href="https://threejs.org/docs/">Three.js documentation</a>.</p><pre>{escape(license_text)}</pre></details>
</main><script type="application/json" id="activity-data">{embedded}</script><script type="module">{script}</script></body></html>'''
(ROOT / 'index.html').write_text(html)
print(json.dumps({'page': 'index.html', 'bytes': len(html.encode()), 'staticTableRows': len(rows), 'threeVersion': '0.170.0'}))
