import { HtmlText } from './html_text.js';
import { EVENT_KINDS, KIND_LABELS, KIND_NAMES } from './module_history_store.js';
import { TimelineChart } from './timeline_chart.js';

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
//	TimelineSection — the filters, the chart, the list, and the detail panel of the timeline
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

export class TimelineSection {
	/**
	 * Builds the timeline in an element.
	 *
	 * @param {import('./module_history_store.js').ModuleHistoryStore} store - The records.
	 * @param {HTMLElement} root - The element that receives the timeline.
	 */
	constructor(store, root) {
		/** The records. */
		this.store = store;
		/** The element that receives the timeline. */
		this.root = root;
		/** @type {import('./module_history_store.js').TimelineFilter} The filter that the reader sets. */
		this.filter = TimelineSection._defaultFilter();
		/** @type {string | null} The key of the selected record. */
		this.selectedKey = null;
		this._renderLayout();
		/** The chart. */
		this.chart = new TimelineChart(
			this.root.querySelector('#timeline-chart'),
			(key) => {
				this.select(key, true);
			},
			(key) => {
				return this._tooltipText(key);
			},
		);
		this._attachEvents();
		this._update();
	}

	/**
	 * Selects a record, or clears the selection when the key is already selected.
	 *
	 * @param {string} key - The key of the record.
	 * @param {boolean} shouldScroll - True to scroll the list to the record.
	 */
	select(key, shouldScroll) {
		this.selectedKey = this.selectedKey === key ? null : key;
		this._update();
		if (shouldScroll === true && this.selectedKey !== null) {
			const row = this.root.querySelector(`.event-row[data-key="${CSS.escape(key)}"]`);
			row?.scrollIntoView({
				block: 'nearest',
			});
		}
	}

	/**
	 * Shows only the commits that change a file of the package, and the records linked to them.
	 *
	 * @param {string | null} filePath - A path inside the package, or null to remove the file filter.
	 */
	setFileFilter(filePath) {
		this.filter.filePath = filePath;
		this.selectedKey = null;
		this._update();
	}

	/**
	 * Returns the filter that shows every kind of record and every day.
	 *
	 * @returns {import('./module_history_store.js').TimelineFilter} The filter.
	 */
	static _defaultFilter() {
		return {
			kinds: new Set(EVENT_KINDS),
			showMerges: false,
			onlyDirect: false,
			dayKey: null,
			searchText: '',
			filePath: null,
		};
	}

	/**
	 * Writes the parts of the timeline that never change: the text boxes, the chart area, the list, and the panel.
	 */
	_renderLayout() {
		const htmlContent = /* html */`
			<div class="toolbar" id="timeline-kinds"></div>
			<div class="toolbar">
				<div class="segmented" id="timeline-days" role="group" aria-label="Day"></div>
				<label><input type="checkbox" id="timeline-merges"> Show merge commits</label>
				<label><input type="checkbox" id="timeline-direct"> Only records directly about the package</label>
				<label>Search <input type="search" id="timeline-search" placeholder="Title or body"></label>
				<span id="timeline-file"></span>
				<button class="button" type="button" data-action="reset">Reset the filters</button>
			</div>
			<p class="section-intro" id="timeline-count" aria-live="polite"></p>
			<div class="chart-wrap"><div class="chart" id="timeline-chart"></div></div>
			<p class="legend">
				<span>● circle: commit (size = lines changed in the package; hollow = merge)</span>
				<span>■ square: pull request</span>
				<span>▲ triangle: issue</span>
				<span>◆ diamond: chat session</span>
				<span>Faded marks only mention the package. Red curves link the selected record to its linked records.</span>
			</p>
			<div class="timeline-split">
				<ol class="event-list" id="timeline-list"></ol>
				<aside class="detail" id="timeline-detail" aria-live="polite"></aside>
			</div>
		`;
		this.root.innerHTML = htmlContent;
	}

	/**
	 * Connects the buttons, the check boxes, and the text box.
	 */
	_attachEvents() {
		this.root.addEventListener('click', (event) => {
			const target = event.target.closest('[data-action]');
			if (target === null) {
				return;
			}
			this._handleAction(target.dataset);
		});
		this.root.addEventListener('change', (event) => {
			const target = event.target;
			if (target.dataset.kind !== undefined) {
				this._toggleKind(target.dataset.kind, target.checked);
			} else if (target.id === 'timeline-merges') {
				this.filter.showMerges = target.checked;
				this._update();
			} else if (target.id === 'timeline-direct') {
				this.filter.onlyDirect = target.checked;
				this._update();
			}
		});
		this.root.addEventListener('input', (event) => {
			if (event.target.id === 'timeline-search') {
				this.filter.searchText = event.target.value;
				this._update();
			}
		});
	}

	/**
	 * Runs the action of a button.
	 *
	 * @param {DOMStringMap} data - The data attributes of the button.
	 */
	_handleAction(data) {
		if (data.action === 'select-event') {
			this.select(data.key, false);
		} else if (data.action === 'select-day') {
			this.filter.dayKey = data.day === '' ? null : data.day;
			this._update();
		} else if (data.action === 'clear-file') {
			this.setFileFilter(null);
		} else if (data.action === 'reset') {
			this.filter = TimelineSection._defaultFilter();
			this.selectedKey = null;
			this.root.querySelector('#timeline-search').value = '';
			this.root.querySelector('#timeline-merges').checked = false;
			this.root.querySelector('#timeline-direct').checked = false;
			this._update();
		} else if (data.action === 'copy') {
			navigator.clipboard?.writeText(data.text).catch(() => {
				return undefined;
			});
		}
	}

	/**
	 * Shows or hides one kind of record.
	 *
	 * @param {import('./module_history_store.js').EventKind} kind - The kind of record.
	 * @param {boolean} isShown - True to show the kind.
	 */
	_toggleKind(kind, isShown) {
		if (isShown === true) {
			this.filter.kinds.add(kind);
		} else {
			this.filter.kinds.delete(kind);
		}
		this._update();
	}

	/**
	 * Draws again every part that depends on the filter or on the selection.
	 */
	_update() {
		const events = this.store.filterEvents(this.filter);
		const dayEvents = this.store.events.filter((event) => {
			return this.filter.dayKey === null || event.at.slice(0, 10) === this.filter.dayKey;
		});
		const linkedKeys = this.store.getLinkedKeys(this.selectedKey);
		this._renderKinds();
		this._renderDays();
		this._renderFileChip();
		const countText = `${HtmlText.count(events.length, 'record', 'records')} shown of ${this.store.events.length}.`;
		this.root.querySelector('#timeline-count').textContent =
			`${countText} Click a mark or a row to see the record and its links.`;
		this.chart.render(events, dayEvents, this.selectedKey, linkedKeys);
		this._renderList(events, linkedKeys);
		this._renderDetail();
	}

	/**
	 * Draws the check boxes of the four kinds of record.
	 */
	_renderKinds() {
		const htmlContent = EVENT_KINDS.map((kind) => {
			const count = this.store.events.filter((event) => {
				return event.kind === kind && (event.isMerge === false || this.filter.showMerges === true);
			}).length;
			return /* html */`
				<label>
					<input type="checkbox" data-kind="${kind}" ${this.filter.kinds.has(kind) ? 'checked' : ''}>
					<span class="kind-swatch is-${kind}"></span> ${KIND_LABELS[kind]} (${count})
				</label>
			`;
		}).join('');
		this.root.querySelector('#timeline-kinds').innerHTML = htmlContent;
	}

	/**
	 * Draws the buttons that choose a day.
	 */
	_renderDays() {
		const dayButtons = this.store.getDays().map((day) => {
			const label = `${HtmlText.formatDay(day.dayKey).slice(0, 6)} (${day.count})`;
			return /* html */`
				<button type="button" data-action="select-day" data-day="${day.dayKey}"
					aria-pressed="${this.filter.dayKey === day.dayKey}">${label}</button>
			`;
		}).join('');
		const htmlContent = /* html */`
			<button type="button" data-action="select-day" data-day=""
				aria-pressed="${this.filter.dayKey === null}">All days</button>
			${dayButtons}
		`;
		this.root.querySelector('#timeline-days').innerHTML = htmlContent;
	}

	/**
	 * Draws the chip that names the file filter.
	 */
	_renderFileChip() {
		const element = this.root.querySelector('#timeline-file');
		if (this.filter.filePath === null) {
			element.innerHTML = '';
			return;
		}
		const htmlContent = /* html */`
			<span class="chip">Commits that change <code>${HtmlText.escape(this.filter.filePath)}</code>
				<button type="button" data-action="clear-file" aria-label="Remove the file filter">✕</button></span>
		`;
		element.innerHTML = htmlContent;
	}

	/**
	 * Draws the list of records, grouped by day.
	 *
	 * @param {import('./module_history_store.js').TimelineEvent[]} events - The records to list.
	 * @param {Set<string>} linkedKeys - The keys of the records linked to the selected record.
	 */
	_renderList(events, linkedKeys) {
		const list = this.root.querySelector('#timeline-list');
		if (events.length === 0) {
			list.innerHTML = '<li class="empty-state" style="padding: 12px">No record passes the filters.</li>';
			return;
		}
		let previousDay = '';
		const rows = [];
		for (const event of events) {
			const dayKey = event.at.slice(0, 10);
			if (dayKey !== previousDay) {
				previousDay = dayKey;
				rows.push(/* html */`<li class="day-heading">${HtmlText.formatDay(dayKey)}</li>`);
			}
			rows.push(this._rowHtml(event, linkedKeys));
		}
		list.innerHTML = rows.join('');
	}

	/**
	 * Writes one row of the list.
	 *
	 * @param {import('./module_history_store.js').TimelineEvent} event - A record.
	 * @param {Set<string>} linkedKeys - The keys of the records linked to the selected record.
	 * @returns {string} The HTML of the row.
	 */
	_rowHtml(event, linkedKeys) {
		const classes = ['event-row'];
		if (event.key === this.selectedKey) {
			classes.push('is-selected');
		} else if (linkedKeys.has(event.key) === true) {
			classes.push('is-related');
		}
		if (event.isDirect === false) {
			classes.push('is-indirect');
		}
		const kindName = KIND_NAMES[event.kind] + (event.isMerge === true ? ' (merge)' : '');
		const htmlContent = /* html */`
			<li><button type="button" class="${classes.join(' ')}" data-action="select-event"
				data-key="${HtmlText.escape(event.key)}">
				<span class="event-time">${HtmlText.formatTime(event.at)} UTC</span>
				<span class="event-title">
					<span class="event-kind is-${event.kind}">${kindName}</span>${HtmlText.escape(event.title)}
					<span class="event-meta">${HtmlText.escape(this._rowMeta(event))}</span></span>
			</button></li>
		`;
		return htmlContent;
	}

	/**
	 * Writes the small gray line under the title of a row.
	 *
	 * @param {import('./module_history_store.js').TimelineEvent} event - A record.
	 * @returns {string} The text.
	 */
	_rowMeta(event) {
		const record = event.record;
		if (event.kind === 'commit') {
			const files = HtmlText.count(record.packageFiles.length, 'file', 'files');
			return `${record.hash.slice(0, 10)} · ${files} in the package, ${event.size} lines`;
		}
		if (event.kind === 'pull_request') {
			return `${record.state.toLowerCase()} · ${record.changedFiles} files, +${record.additions} −${record.deletions}`;
		}
		if (event.kind === 'issue') {
			const comments = HtmlText.count(record.commentCount, 'comment', 'comments');
			return `${record.state.toLowerCase()} · ${comments}${event.isDirect ? '' : ' · only mentions the package'}`;
		}
		const agent = record.codingAgent === 'CODEX' ? 'Codex' : 'Claude Code';
		const messages = HtmlText.count(record.userMessageCount, 'message', 'messages');
		return `${agent} · ${messages}${event.isDirect ? '' : ' · linked to related records only'}`;
	}

	/**
	 * Writes the text of the tooltip of a mark.
	 *
	 * @param {string} key - The key of a record.
	 * @returns {string} The text.
	 */
	_tooltipText(key) {
		const event = this.store.eventsByKey.get(key);
		return `${KIND_NAMES[event.kind]} · ${HtmlText.formatShort(event.at)} UTC · ${HtmlText.truncate(event.title, 110)}`;
	}

	/**
	 * Draws the detail panel of the selected record.
	 */
	_renderDetail() {
		const element = this.root.querySelector('#timeline-detail');
		const event = this.selectedKey === null ? undefined : this.store.eventsByKey.get(this.selectedKey);
		if (event === undefined) {
			element.innerHTML = '<p class="empty-state">Select a record in the chart or in the list '
				+ 'to read its details and see its links.</p>';
			return;
		}
		const kindName = KIND_NAMES[event.kind] + (event.isMerge === true ? ' (merge)' : '');
		const addressHtmlContent = event.url === null ? '' : /* html */`
			<p><a href="${HtmlText.escape(event.url)}" target="_blank" rel="noopener">
				Open the ${KIND_NAMES[event.kind].toLowerCase()} on GitHub</a></p>
		`;
		const htmlContent = /* html */`
			<h3>${HtmlText.escape(event.title)}</h3>
			<dl>
				<dt>Kind</dt><dd>${kindName}</dd>
				<dt>Date</dt><dd>${HtmlText.formatLong(event.at)}</dd>
				${this._detailRows(event)}
			</dl>
			${this._detailBody(event)}
			${addressHtmlContent}
			${this._linkedHtml(event)}
		`;
		element.innerHTML = htmlContent;
	}

	/**
	 * Writes the rows of the detail panel that depend on the kind of record.
	 *
	 * @param {import('./module_history_store.js').TimelineEvent} event - The selected record.
	 * @returns {string} The HTML of the rows.
	 */
	_detailRows(event) {
		const record = event.record;
		const rows = [];
		if (event.kind === 'commit') {
			rows.push(['Hash', record.hash], ['Author', record.authorName]);
			rows.push(['Size', `${record.insertions} added and ${record.deletions} deleted lines in the whole commit`]);
		} else if (event.kind === 'pull_request') {
			rows.push(['State', record.state], ['Branch', record.headRefName]);
			rows.push(['Size', `${record.changedFiles} files, +${record.additions} −${record.deletions}`]);
			rows.push(['Opened', HtmlText.formatLong(record.createdAt)]);
			rows.push(['Why listed', record.reasons.join(' ')]);
		} else if (event.kind === 'issue') {
			const reason = record.stateReason === null ? '' : ` (${record.stateReason})`;
			rows.push(['State', record.state + reason], ['Author', record.author]);
			rows.push(['Comments', String(record.commentCount)]);
			rows.push(['Closed', record.closedAt === null ? 'not closed' : HtmlText.formatLong(record.closedAt)]);
			rows.push(['Why listed', record.reasons.map((item) => {
				return item.text;
			}).join(' ')]);
		} else {
			rows.push(['Coding agent', record.codingAgent === 'CODEX' ? 'Codex' : 'Claude Code']);
			rows.push(['Messages typed', String(record.userMessageCount)]);
			rows.push(['Last record', record.lastRecordAt === null ? 'unknown' : HtmlText.formatLong(record.lastRecordAt)]);
			rows.push(['Why listed', record.reasons.map((item) => {
				return item.type === 'file' ? `wrote ${item.path}` : `linked to ${item.type.replace('_', ' ')} ${item.number}`;
			}).join(', ')]);
		}
		return rows.map(([name, value]) => {
			return /* html */`<dt>${HtmlText.escape(name)}</dt><dd>${HtmlText.escape(value)}</dd>`;
		}).join('');
	}

	/**
	 * Writes the body of the detail panel: the message, the text, or the command to read the chat session.
	 *
	 * @param {import('./module_history_store.js').TimelineEvent} event - The selected record.
	 * @returns {string} The HTML.
	 */
	_detailBody(event) {
		const record = event.record;
		if (event.kind === 'commit') {
			const prefixLength = `packages/${this.store.data.module}/`.length;
			const files = record.packageFiles.map((file) => {
				return /* html */`
					<li><code>${HtmlText.escape(file.path.slice(prefixLength))}</code> +${file.insertions} −${file.deletions}</li>
				`;
			}).join('');
			const message = `${record.subject}\n\n${record.body ?? ''}`.trim();
			const htmlContent = /* html */`
				<pre>${HtmlText.escape(message)}</pre>
				<p>Files of the package changed by this commit:</p>
				<ul class="linked-list">${files}</ul>
			`;
			return htmlContent;
		}
		if (event.kind === 'chat_session') {
			const command = `heidrun_data read chat_session ${record.id}`;
			const htmlContent = /* html */`
				<p>A chat session has no address on GitHub. To read it, start this command in a folder of the
					repository Heidrun Notebook:</p>
				<pre>${HtmlText.escape(command)}</pre>
				<button class="button" type="button" data-action="copy"
					data-text="${HtmlText.escape(command)}">Copy the command</button>
			`;
			return htmlContent;
		}
		const htmlContent = /* html */`<pre>${HtmlText.escape(HtmlText.truncate(record.body ?? '', 1500))}</pre>`;
		return htmlContent;
	}

	/**
	 * Writes the list of records linked to the selected record.
	 *
	 * @param {import('./module_history_store.js').TimelineEvent} event - The selected record.
	 * @returns {string} The HTML.
	 */
	_linkedHtml(event) {
		const linked = [...this.store.getLinkedKeys(event.key)].map((key) => {
			return this.store.eventsByKey.get(key);
		}).sort((left, right) => {
			return left.at.localeCompare(right.at);
		});
		if (linked.length === 0) {
			return '<p class="empty-state">No linked record found in the data.</p>';
		}
		const items = linked.map((item) => {
			return /* html */`
				<li><button type="button" data-action="select-event" data-key="${HtmlText.escape(item.key)}">
					${KIND_NAMES[item.kind]}: ${HtmlText.escape(HtmlText.truncate(item.title, 90))}</button></li>
			`;
		}).join('');
		const htmlContent = /* html */`
			<h3>Linked records (${linked.length})</h3>
			<ul class="linked-list">${items}</ul>
		`;
		return htmlContent;
	}
}
