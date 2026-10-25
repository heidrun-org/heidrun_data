import { HtmlText } from './html_text.js';

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
//	OverviewSections — writes the counts, the files, the related packages, and the method of the page
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

export class OverviewSections {
	/**
	 * Connects the writer to the store.
	 *
	 * @param {import('./module_history_store.js').ModuleHistoryStore} store - The records and the statements.
	 * @param {import('./statement_sections.js').StatementSections} statementSections - Writes the statements.
	 */
	constructor(store, statementSections) {
		/** The records and the statements. */
		this.store = store;
		/** Writes the statements. */
		this.statementSections = statementSections;
	}

	/**
	 * Writes the count cards of the summary.
	 *
	 * @returns {string} The HTML of the cards.
	 */
	countsHtml() {
		const data = this.store.data;
		const ownCommits = data.commits.filter((commit) => {
			return commit.isMerge === false;
		});
		const mergeCount = data.commits.length - ownCommits.length;
		const lines = ownCommits.reduce((total, commit) => {
			return total + commit.packageFiles.reduce((sum, file) => {
				return sum + file.insertions + file.deletions;
			}, 0);
		}, 0);
		const first = data.commits[0].at;
		const last = data.commits[data.commits.length - 1].at;
		const cards = [
			[ownCommits.length, `commits change files of the package, plus ${mergeCount} merge commits`],
			[data.pullRequests.length, 'pull requests'],
			[data.issues.length, `issues (${data.issues.filter((issue) => {
				return issue.isDirect;
			}).length} directly about the package)`],
			[data.chatSessions.length, `chat sessions (${data.chatSessions.filter((session) => {
				return session.isDirect;
			}).length} directly linked)`],
			[data.files.length, 'file paths of the package changed'],
			[lines, 'lines added or deleted in the package'],
		];
		const items = cards.map(([number, label]) => {
			return /* html */`<div class="count-card"><strong>${number}</strong><span>${HtmlText.escape(label)}</span></div>`;
		}).join('');
		const htmlContent = /* html */`
			<div class="counts">${items}</div>
			<p class="section-intro">From the first to the last commit that changes the package:
				${HtmlText.formatLong(first)} to ${HtmlText.formatLong(last)}.
				The whole repository holds ${data.repositoryTotals.commits} commits,
				${data.repositoryTotals.issues} issues, and ${data.repositoryTotals.pullRequests} pull requests.</p>
		`;
		return htmlContent;
	}

	/**
	 * Writes the tables of the files that the history changed. A click on a path filters the timeline.
	 *
	 * @returns {string} The HTML.
	 */
	filesHtml() {
		const files = this.store.data.files;
		const maximum = Math.max(...files.map((file) => {
			return file.insertions + file.deletions;
		}));
		const topRows = files.slice(0, 12).map((file) => {
			return this._fileRowHtml(file, maximum);
		}).join('');
		const otherRows = files.slice(12).map((file) => {
			return this._fileRowHtml(file, maximum);
		}).join('');
		const htmlContent = /* html */`
			<h3>Files that changed most often</h3>
			<p class="section-intro">A file that was renamed appears under each of its paths. The commit that renames a file
				counts under the new path. Click a path to show only the commits that change it.</p>
			<table class="bar-table">
				<thead><tr><th>Path in the package</th><th>Commits</th><th class="bar-cell">Lines added (blue) and deleted
					(red)</th></tr></thead>
				<tbody>${topRows}</tbody>
			</table>
			<details>
				<summary>All ${files.length} paths</summary>
				<table class="bar-table"><tbody>${otherRows}</tbody></table>
			</details>
			${this._foldersHtml()}
		`;
		return htmlContent;
	}

	/**
	 * Writes the packages that changed in the same commits as the package, and the limit of this view.
	 *
	 * @returns {string} The HTML.
	 */
	relationshipsHtml() {
		const data = this.store.data;
		const ownCommits = data.commits.filter((commit) => {
			return commit.isMerge === false;
		});
		const rows = data.coChange.map((entry) => {
			const percentage = Math.round((entry.commits / ownCommits.length) * 100);
			const links = entry.hashes.map((hash) => {
				const commit = data.commits.find((candidate) => {
					return candidate.hash === hash;
				});
				const url = `${data.githubBase}/commit/${hash}`;
				return /* html */`<li><a href="${url}" target="_blank" rel="noopener">commit ${hash.slice(0, 10)}</a>
					${HtmlText.escape(commit.subject)}</li>`;
			}).join('');
			return /* html */`
				<tr>
					<td><details><summary><code>${HtmlText.escape(entry.area)}</code></summary><ul>${links}</ul></details></td>
					<td>${entry.commits} of ${ownCommits.length} (${percentage} %)</td>
					<td class="bar-cell"><span class="bar" style="width: ${percentage}%"></span></td>
				</tr>
			`;
		}).join('');
		const topArea = data.coChange[0];
		const interpretation = {
			status: 'interpretation',
			text: `The package often changes together with ${topArea.area} `
				+ `(${topArea.commits} of ${ownCommits.length} commits). `
				+ 'This suggests that the command line tool depends on the server and on the website, '
				+ 'but changes in the same commit do not prove a dependency.',
			sources: topArea.hashes.slice(0, 4).map((hash) => {
				return {
					kind: 'commit',
					id: hash.slice(0, 10),
					part: 'message',
				};
			}),
		};
		const unknown = {
			status: 'unknown',
			text: 'The data holds no static code analysis, so the real dependencies and calls are not known. '
				+ 'The table only shows the areas that changed in the same commits.',
			sources: [
				{
					kind: 'commit',
					id: data.commits[0].hash.slice(0, 10),
					part: 'message',
				},
			],
		};
		const htmlContent = /* html */`
			${this.statementSections.listHtml([interpretation, unknown])}
			<table class="bar-table" style="margin-top: 16px">
				<thead><tr><th>Area that changed in the same commits</th><th>Commits</th><th
					class="bar-cell">Share</th></tr></thead>
				<tbody>${rows}</tbody>
			</table>
		`;
		return htmlContent;
	}

	/**
	 * Writes the data sources, the rules of the page, the commands that ran, and the result of the check.
	 *
	 * @returns {string} The HTML.
	 */
	methodHtml() {
		const data = this.store.data;
		const verification = this.store.verification;
		const sources = data.sources.map((source) => {
			return /* html */`<li><code>${HtmlText.escape(source.source)}</code>: newest record
				${HtmlText.formatLong(source.lastUpdatedAt)}</li>`;
		}).join('');
		const commands = data.executedCommands.map((entry) => {
			return /* html */`<li>${HtmlText.escape(entry.purpose)}<code>${HtmlText.escape(entry.command)}</code></li>`;
		}).join('');
		const failures = verification.failures.map((failure) => {
			return /* html */`<li>${HtmlText.escape(failure.source)}: ${HtmlText.escape(failure.reason)}</li>`;
		}).join('');
		const htmlContent = /* html */`
			<h3>Where the data comes from</h3>
			<ul class="method-list">
				<li>Database: <code>databases/heidrun_data_example_database.sqlite</code>, the repository
					<code>${HtmlText.escape(data.repository)}</code>. Every record comes through the command line
					<code>heidrun_data</code>. The page collected no record with Git or GitHub.</li>
				<li>Collected on ${HtmlText.formatLong(data.generatedAt)}. Newest record of each source:<ul>${sources}</ul></li>
				<li>All times are in UTC.</li>
			</ul>
			<h3>How the records were chosen</h3>
			<ul class="method-list">
				<li>A <strong>commit</strong> belongs to the package when it changes at least one file under
					<code>packages/${HtmlText.escape(data.module)}/</code>. The files of each commit come from
					<code>heidrun_data read commit</code>. A merge commit is listed separately, and the files of a merge are the
						files it brings in.</li>
				<li>A <strong>pull request</strong> belongs to the package when its merge commit changes files of the package, or
					when its title or body names the package.</li>
				<li>An <strong>issue</strong> belongs to the package when a commit of the package or a pull request of the package
					says "fixes" or "part of" for it,
					or when its title names the package or the command line tool, or when its body names the package.
					An issue is <em>directly about the package</em> when its title names the package or a commit or pull request of
						the package fixes it.</li>
				<li>A <strong>chat session</strong> belongs to the package when the data links it to one of those issues or pull
					requests,
					or when it wrote a file of the package. It is <em>directly linked</em> when it wrote a file or is linked to a
						direct record.</li>
				<li>A link between two records is a number in a message or a body ("fixes #23", "Part of #3"), the merge commit of
					a pull request,
					or a link of the table of chat sessions. The page draws no link that the records do not state.</li>
			</ul>
			<h3>Check of the sources</h3>
			<p>${verification.sourceCount} sources of the statements were read again with <code>heidrun_data</code>
				on ${HtmlText.formatLong(verification.checkedAt)}. ${verification.quoteCount} quotes were searched in the original
					record.
				Failures: <strong>${verification.failureCount}</strong>.</p>
			${failures === '' ? '' : `<ul>${failures}</ul>`}
			<h3>Limits</h3>
			<ul class="method-list">
				<li>The page does not read the current source files, because <code>heidrun_data</code> does not give them.</li>
				<li>The search for a reason in the chat sessions is a keyword search, not a full reading.</li>
				<li>Records written after the newest record of each source are missing until <code>heidrun_data update</code>
					runs.</li>
			</ul>
			<details>
				<summary>${data.executedCommands.length} commands of <code>heidrun_data</code> collected the records</summary>
				<ol class="command-list">${commands}</ol>
			</details>
			<h3>Automatic reload</h3>
			<p>Opened through the local server (<code>python3 outputs/serve_outputs.py</code>), this page reloads by itself
				within two seconds after a saved change of <code>index.html</code>. A change of another file of the experiment
					needs a manual reload.
				A page opened directly as a local file cannot load its data files and does not reload by itself.</p>
		`;
		return htmlContent;
	}

	/**
	 * Writes the table that sums the changes of each folder of the package.
	 *
	 * @returns {string} The HTML.
	 */
	_foldersHtml() {
		/** @type {Map<string, { touches: number, insertions: number, deletions: number }>} */
		const folders = new Map();
		for (const file of this.store.data.files) {
			const folder = file.path.includes('/') ? `${file.path.split('/')[0]}/` : '(files at the root of the package)';
			const entry = folders.get(folder) ?? {
				touches: 0,
				insertions: 0,
				deletions: 0,
			};
			entry.touches += file.commits;
			entry.insertions += file.insertions;
			entry.deletions += file.deletions;
			folders.set(folder, entry);
		}
		const rows = [...folders.entries()].sort((left, right) => {
			return right[1].insertions + right[1].deletions - (left[1].insertions + left[1].deletions);
		}).map(([folder, entry]) => {
			return /* html */`
				<tr>
					<td><code>${HtmlText.escape(folder)}</code></td><td>${entry.touches}</td>
					<td>+${entry.insertions}</td><td>−${entry.deletions}</td>
				</tr>
			`;
		}).join('');
		const htmlContent = /* html */`
			<h3>Changes by folder</h3>
			<table class="bar-table">
				<thead><tr><th>Folder</th><th>File changes</th><th>Added</th><th>Deleted</th></tr></thead>
				<tbody>${rows}</tbody>
			</table>
		`;
		return htmlContent;
	}

	/**
	 * Writes one row of the table of files.
	 *
	 * @param {Record<string, any>} file - A file of the package, with its totals.
	 * @param {number} maximum - The largest number of changed lines of a file, which sets the bar width.
	 * @returns {string} The HTML of the row.
	 */
	_fileRowHtml(file, maximum) {
		const added = (file.insertions / maximum) * 100;
		const deleted = (file.deletions / maximum) * 100;
		const htmlContent = /* html */`
			<tr>
				<td><button type="button" data-action="filter-file"
					data-path="${HtmlText.escape(file.path)}">${HtmlText.escape(file.path)}</button></td>
				<td>${file.commits}</td>
				<td class="bar-cell" title="+${file.insertions} −${file.deletions}">
					<span class="bar" style="width: ${added}%"></span>
					<span class="bar is-deletions" style="width: ${deleted}%"></span>
				</td>
			</tr>
		`;
		return htmlContent;
	}
}
