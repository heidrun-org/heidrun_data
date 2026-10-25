"""Build self-contained daily metric calendars from the supplied repository databases."""
from pathlib import Path
from datetime import date, datetime, timedelta
from zoneinfo import ZoneInfo
from collections import defaultdict
from html import escape
import json
import subprocess

EXPERIMENT = Path(__file__).resolve().parent
ROOT = Path(__file__).resolve().parents[3]
END = date(2026, 10, 23)
START = END - timedelta(days=364)
GRID_START = START - timedelta(days=(START.weekday() + 1) % 7)
ZONE = ZoneInfo('Europe/Paris')
SINCE = datetime.combine(START, datetime.min.time(), ZONE).astimezone(ZoneInfo('UTC')).isoformat().replace('+00:00', 'Z')
UNTIL = datetime.combine(END + timedelta(days=1), datetime.min.time(), ZONE).astimezone(ZoneInfo('UTC')).isoformat().replace('+00:00', 'Z')
NAME = 'heidrun_code_heidrun_notebook_heidrun_data_daily_activity_metrics_2025-10-24_to_2026-10-23'
COLORS = ['#161b22', '#5c1821', '#a32938', '#e55361', '#ff9b9b']
SOURCES = [
    ('Heidrun Code', 'heidrun-org/heidrun_code', 'databases/heidrun_code.sqlite'),
    ('Heidrun Notebook', 'heidrun-org/heidrun_notebook', 'databases/heidrun_data_example_database.sqlite'),
    ('Heidrun Data', 'heidrun-org/heidrun_data', 'databases/heidrun_data_commits.sqlite'),
]
METRICS = {
    'commits': {'label': 'Commits', 'unit': 'commits', 'description': 'Count commits by committedAt, including merge commits and all authors.'},
    'pullRequests': {'label': 'Pull requests opened', 'unit': 'pull requests opened', 'description': 'Count pull requests by createdAt, regardless of their later state. A pull request and a commit can describe the same work.'},
    'lines': {'label': 'Lines changed', 'unit': 'lines changed', 'description': 'Sum insertions plus deletions for non-merge commits, grouped by committedAt. Merge commits are excluded to avoid counting edits again at merge time. Includes all file types recorded by Git, including generated files and formatting changes; measures editing volume, not quality or productivity.'},
    'tokens': {'label': 'AI tokens', 'unit': 'tokens', 'description': 'Sum fresh input, cached input, cache-write input, and output tokens by minuteAt. Includes the repository’s recorded worktree and subfolder usage. An operation is assigned to the minute of its usage record, rather than spread over its duration.'},
    'cost': {'label': 'Estimated AI cost (US dollars)', 'unit': 'US dollars estimated', 'description': 'Sum costUsd from token_usage_with_cost by minuteAt. Uses the latest stored model-price version in each database for every date. This is an estimate from public model prices, not an invoice or subscription payment. Unpriced records produce a partial estimate; completely unpriced days are unavailable.'},
}

def query(database, statement):
    result = subprocess.run([str(ROOT.parent / 'target/debug/heidrun_data'), 'query', '--database', str(ROOT / database), '--format', 'jsonl', '--limit', '0', statement], check=True, capture_output=True, text=True)
    return [json.loads(line) for line in result.stdout.splitlines() if line]

def local_day(timestamp):
    return datetime.fromisoformat(timestamp.replace('Z', '+00:00')).astimezone(ZONE).date().isoformat()

def coverage(label, timestamps):
    if not timestamps:
        return f'{label}: no records available in this snapshot.'
    return f'{label}: recorded dates {local_day(min(timestamps))} through {local_day(max(timestamps))}.'

repositories = []
sections = []
for index, (name, repository, database) in enumerate(SOURCES):
    commits = query(database, f"SELECT committedAt, data FROM commits WHERE repository = '{repository}' ORDER BY committedAt")
    pulls = query(database, f"SELECT json_extract(data, '$.createdAt') AS createdAt FROM pull_requests WHERE repository = '{repository}'")
    usage = query(database, f"SELECT minuteAt, sum(freshInputTokens + cachedInputTokens + cacheWriteInputTokens + outputTokens) AS tokens, sum(costUsd) AS cost, count(*) AS records, count(*) - count(costUsd) AS unpricedRows FROM token_usage_with_cost WHERE repository = '{repository}' AND minuteAt >= '{SINCE}' AND minuteAt < '{UNTIL}' GROUP BY minuteAt")
    synchronizations = query(database, f"SELECT synchronizedAt, readUpTo FROM token_usage_synchronizations WHERE repository = '{repository}'")
    prices = query(database, 'SELECT version, retrievedAt, source FROM model_price_versions ORDER BY version DESC LIMIT 1')
    undated = query(database, f"SELECT count(*) AS records FROM token_usage_minutes WHERE repository = '{repository}' AND minuteAt = ''")[0]['records']
    daily = {}
    for offset in range(365):
        key = (START + timedelta(days=offset)).isoformat()
        daily[key] = {'commits': 0, 'pullRequests': 0, 'lines': 0, 'added': 0, 'removed': 0, 'tokens': 0, 'cost': 0, 'unpricedRows': 0, 'pricedRows': 0}
    for commit in commits:
        key = local_day(commit['committedAt'])
        if key not in daily:
            continue
        day = daily[key]
        day['commits'] += 1
        data = json.loads(commit['data'])
        if len(data['parents']) < 2:
            day['added'] += data['insertions']
            day['removed'] += data['deletions']
            day['lines'] += data['insertions'] + data['deletions']
    for pull in pulls:
        key = local_day(pull['createdAt'])
        if key in daily:
            daily[key]['pullRequests'] += 1
    for record in usage:
        key = local_day(record['minuteAt'])
        if key in daily:
            day = daily[key]
            day['tokens'] += record['tokens']
            day['cost'] += record['cost'] or 0
            day['unpricedRows'] += record['unpricedRows']
            day['pricedRows'] += record['records'] - record['unpricedRows']
    # Empty tables do not prove a complete import or zero activity.
    available = {'commits': bool(commits), 'lines': bool(commits), 'pullRequests': bool(pulls), 'tokens': bool(usage), 'cost': bool(usage)}
    for day in daily.values():
        for metric in METRICS:
            if not available[metric]:
                day[metric] = None
        if day['unpricedRows'] > 0 and day['pricedRows'] == 0:
            day['cost'] = None
    commit_coverage = coverage('Commit history', [row['committedAt'] for row in commits])
    usage_coverage = coverage('AI usage in this range', [row['minuteAt'] for row in usage])
    usage_coverage += f' {undated} undated usage records excluded.'
    if synchronizations:
        usage_coverage += ' Last synchronization: ' + max(row['synchronizedAt'] for row in synchronizations) + '.'
    pull_coverage = coverage('Pull requests opened', [row['createdAt'] for row in pulls])
    if repository == 'heidrun-org/heidrun_data' and not pulls:
        pull_coverage += ' GitHub collection failed because the account’s API rate limit was exceeded.'
    cost_coverage = usage_coverage
    if prices:
        cost_coverage += f" Stored price version {prices[0]['version']}, retrieved {prices[0]['retrievedAt']}."
    metric_coverage = {'commits': commit_coverage, 'lines': commit_coverage, 'pullRequests': pull_coverage, 'tokens': usage_coverage, 'cost': cost_coverage}
    repositories.append({'name': name, 'repository': repository, 'database': database, 'available': available, 'coverage': metric_coverage, 'prices': prices, 'daily': daily})
    svg = [f'<svg viewBox="0 0 1100 194" role="group" aria-label="Daily activity calendar for {name}">']
    for label, row in [('Mon', 1), ('Wed', 3), ('Fri', 5)]:
        svg.append(f'<text x="0" y="{43 + row * 19}" class="label">{label}</text>')
    previous_month = None
    for offset in range((END - GRID_START).days + 1):
        day = GRID_START + timedelta(days=offset)
        if day < START:
            continue
        column, row = divmod(offset, 7)
        x, y = 50 + column * 19, 30 + row * 19
        if day.month != previous_month:
            # Skip the partial first month label if the next label would overlap.
            if day.day == 1:
                svg.append(f'<text x="{x}" y="19" class="label">{day.strftime("%b")}</text>')
            previous_month = day.month
        count = daily[day.isoformat()]['commits'] or 0
        label = f'{day}: {count} commits'
        svg.append(f'<rect data-day="{day}" x="{x}" y="{y}" width="15" height="15" rx="3" fill="{COLORS[1] if count else COLORS[0]}" tabindex="0" aria-label="{label}"><title>{label}</title></rect>')
    svg.append('</svg>')
    total = sum(day['commits'] or 0 for day in daily.values())
    sections.append(f'<section id="repository-{index}"><h2>{name}</h2><p class="total" aria-live="polite">{total:,} commits</p><div class="calendar">{"".join(svg)}</div><p class="coverage">{escape(commit_coverage)}</p><p class="note">{escape(repository)} · Source: {escape(database)}</p></section>')

data = {'start': str(START), 'end': str(END), 'timeZone': 'Europe/Paris', 'colors': COLORS, 'metrics': METRICS, 'repositories': repositories}
options = ''.join(f'<option value="{key}">{escape(value["label"])}</option>' for key, value in METRICS.items())
script = (EXPERIMENT / 'calendar_metrics.js').read_text()
embedded = json.dumps(data).replace('<', '\\u003c')
html = f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Heidrun Code, Heidrun Notebook, and Heidrun Data daily activity metrics · 24 October 2025–23 October 2026</title>
<style>
:root{{color-scheme:dark;font-family:system-ui,sans-serif;background:#0d1117;color:#e6edf3}}body{{max-width:1200px;margin:48px auto;padding:0 24px;line-height:1.6}}a{{color:#79c0ff}}h1{{font-size:32px;line-height:1.25}}h2{{margin:0;font-size:23px}}.intro,.note,.coverage{{color:#919ba7}}section,.controls{{border:1px solid #30363d;border-radius:12px;padding:28px;margin:28px 0}}.total{{font-size:22px;margin:8px 0 22px}}.calendar{{overflow-x:auto}}svg{{display:block;width:100%;min-width:850px}}.label{{fill:#919ba7;font-size:13px}}rect:focus,rect:hover{{stroke:#fff;stroke-width:2;outline:none}}#legend{{display:flex;flex-wrap:wrap;gap:16px;font-size:13px}}#legend span{{display:inline-flex;gap:6px;align-items:center}}i{{display:inline-block;width:14px;height:14px;border-radius:3px}}.note,.coverage,footer{{font-size:13px}}select{{font:inherit;padding:8px 12px;margin:8px;border:1px solid #606974;border-radius:6px;background:#161b22;color:#e6edf3}}footer{{color:#919ba7}}@media(max-width:600px){{body{{margin:28px auto;padding:0 16px}}section,.controls{{padding:18px}}h1{{font-size:27px}}}}
</style></head><body><main><a href="../index.html">← Workspace navigation</a><h1>Heidrun Code, Heidrun Notebook, and Heidrun Data</h1><p class="intro">24 October 2025 – 23 October 2026 · Europe/Paris<br>Each square represents one day. Hover over or focus a square for the date and value.</p>
<div class="controls"><label for="metric">Measure</label><select id="metric">{options}</select><p id="calculation">{escape(METRICS['commits']['description'])}</p><div id="legend" aria-label="Daily value colour scale"></div><p class="note">Colour thresholds use quarters of the largest daily value across all three repositories for the selected measure. The same scale applies to all three calendars.</p></div>
<noscript>Enable JavaScript to switch measures. The initial calendars show commits.</noscript>{''.join(sections)}
<footer><p>All dates are grouped in Europe/Paris time, including daylight saving time. The displayed year ends on 23 October 2026; later activity is excluded. Sources are local snapshots with different collection dates. Empty squares mean no activity recorded, not proof of no historical activity. Grey squares mean data unavailable. The last day may be incomplete.</p><p>Token usage with no timestamp is excluded. AI prices can differ between snapshots; each repository’s price version and retrieval date appear when estimated cost is selected. Missing prices are never treated as a known zero cost.</p></footer></main>
<script id="calendar-data" type="application/json">{embedded}</script><script>{script}</script></body></html>'''
(EXPERIMENT / 'index.html').write_text(html)
(EXPERIMENT / f'{NAME}.json').write_text(json.dumps(data, indent=2))
print(json.dumps([{'repository': r['repository'], 'available': r['available'], 'totals': {m: sum(d[m] or 0 for d in r['daily'].values()) for m in METRICS}, 'unpricedRows': sum(d['unpricedRows'] for d in r['daily'].values())} for r in repositories]))
