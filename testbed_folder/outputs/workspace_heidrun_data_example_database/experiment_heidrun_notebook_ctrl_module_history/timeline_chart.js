import { HtmlText } from './html_text.js';
import { EVENT_KINDS, KIND_LABELS, KIND_NAMES } from './module_history_store.js';

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
//	TimelineChart — draws the records on a time axis, one row of marks for each kind of record
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

const WIDTH = 1100;
const MARGIN_LEFT = 118;
const MARGIN_RIGHT = 24;
const AXIS_HEIGHT = 34;
const LANE_PADDING = 12;
const ROW_HEIGHT = 15;
const HOUR_MILLISECONDS = 3600 * 1000;

export class TimelineChart {
	/**
	 * Connects the chart to its container.
	 *
	 * @param {HTMLElement} container - The element that holds the chart and the tooltip.
	 * @param {(key: string) => void} onSelect - Called with the key of a record when the reader selects it.
	 * @param {(key: string) => string} describe - Returns the text of the tooltip of a record.
	 */
	constructor(container, onSelect, describe) {
		/** The element that holds the chart. */
		this.container = container;
		/** Called when the reader selects a record. */
		this.onSelect = onSelect;
		/** Returns the text of the tooltip of a record. */
		this.describe = describe;
		/** The tooltip element. */
		this.tooltip = document.createElement('div');
		this.tooltip.className = 'tooltip';
		this.tooltip.hidden = true;
		this.container.after(this.tooltip);
		this.container.addEventListener('click', (event) => {
			this._handleClick(event);
		});
		this.container.addEventListener('keydown', (event) => {
			this._handleKeydown(event);
		});
		this.container.addEventListener('mousemove', (event) => {
			this._handleMove(event);
		});
		this.container.addEventListener('mouseleave', () => {
			this.tooltip.hidden = true;
		});
	}

	/**
	 * Draws the chart.
	 *
	 * @param {import('./module_history_store.js').TimelineEvent[]} events - The records to draw.
	 * @param {import('./module_history_store.js').TimelineEvent[]} rangeEvents - The records that set the time axis.
	 * @param {string | null} selectedKey - The key of the selected record.
	 * @param {Set<string>} linkedKeys - The keys of the records linked to the selected record.
	 */
	render(events, rangeEvents, selectedKey, linkedKeys) {
		const range = TimelineChart._computeRange(rangeEvents);
		const lanes = TimelineChart._layoutLanes(events, range);
		const height = AXIS_HEIGHT + lanes.reduce((total, lane) => {
			return total + lane.height;
		}, 0);
		const positions = new Map();
		for (const lane of lanes) {
			for (const mark of lane.marks) {
				positions.set(mark.event.key, mark);
			}
		}
		const gridHtmlContent = TimelineChart._gridHtml(range, height);
		const laneHtmlContent = lanes.map((lane) => {
			return TimelineChart._laneHtml(lane);
		}).join('');
		const linkHtmlContent = TimelineChart._linkHtml(selectedKey, linkedKeys, positions);
		const markHtmlContent = lanes.map((lane) => {
			return lane.marks.map((mark) => {
				return TimelineChart._markHtml(mark, selectedKey, linkedKeys);
			}).join('');
		}).join('');
		const htmlContent = /* html */`
			<svg class="timeline-svg" viewBox="0 0 ${WIDTH} ${height}" role="group"
				aria-label="Records of the package on a time axis, one row for each kind of record">
				${laneHtmlContent}
				${gridHtmlContent}
				${linkHtmlContent}
				${markHtmlContent}
			</svg>
		`;
		this.container.innerHTML = htmlContent;
	}

	/**
	 * Returns the first and the last moment of the time axis.
	 *
	 * @param {import('./module_history_store.js').TimelineEvent[]} events - The records that set the axis.
	 * @returns {{ start: number, end: number }} The two moments in milliseconds.
	 */
	static _computeRange(events) {
		if (events.length === 0) {
			const now = Date.now();
			return {
				start: now - HOUR_MILLISECONDS,
				end: now,
			};
		}
		const times = events.map((event) => {
			return new Date(event.at).getTime();
		});
		const first = Math.min(...times);
		const last = Math.max(...times);
		const padding = Math.max((last - first) * 0.03, HOUR_MILLISECONDS / 2);
		return {
			start: first - padding,
			end: last + padding,
		};
	}

	/**
	 * Places the marks of each lane so that two marks of one lane do not overlap.
	 *
	 * @param {import('./module_history_store.js').TimelineEvent[]} events - The records to draw.
	 * @param {{ start: number, end: number }} range - The time axis.
	 * @returns {{ kind: string, top: number, height: number, marks: Record<string, any>[] }[]} The lanes.
	 */
	static _layoutLanes(events, range) {
		const plotWidth = WIDTH - MARGIN_LEFT - MARGIN_RIGHT;
		const lanes = [];
		let top = AXIS_HEIGHT;
		for (const kind of EVENT_KINDS) {
			const marks = [];
			const rowEnds = [];
			const laneEvents = events.filter((event) => {
				return event.kind === kind;
			});
			for (const event of laneEvents) {
				const x = MARGIN_LEFT + ((new Date(event.at).getTime() - range.start) / (range.end - range.start)) * plotWidth;
				const radius = TimelineChart._radius(event);
				let row = rowEnds.findIndex((rowEnd) => {
					return rowEnd + radius + 2 <= x - radius;
				});
				if (row === -1) {
					row = rowEnds.length;
					rowEnds.push(0);
				}
				rowEnds[row] = x + radius;
				marks.push({
					event: event,
					x: x,
					row: row,
					radius: radius,
					y: 0,
				});
			}
			const height = Math.max(rowEnds.length, 1) * ROW_HEIGHT + LANE_PADDING * 2;
			for (const mark of marks) {
				mark.y = top + LANE_PADDING + mark.row * ROW_HEIGHT + ROW_HEIGHT / 2;
			}
			lanes.push({
				kind: kind,
				top: top,
				height: height,
				marks: marks,
			});
			top += height;
		}
		return lanes;
	}

	/**
	 * Returns the radius of the mark of a record. A commit grows with the lines it changes in the package.
	 *
	 * @param {import('./module_history_store.js').TimelineEvent} event - A record.
	 * @returns {number} The radius in pixels.
	 */
	static _radius(event) {
		if (event.kind === 'commit') {
			return 4 + Math.min(4, Math.sqrt(event.size) / 8);
		}
		return 5.5;
	}

	/**
	 * Draws the vertical lines and the labels of the time axis.
	 *
	 * @param {{ start: number, end: number }} range - The time axis.
	 * @param {number} height - The height of the chart.
	 * @returns {string} The SVG markup.
	 */
	static _gridHtml(range, height) {
		const plotWidth = WIDTH - MARGIN_LEFT - MARGIN_RIGHT;
		const spanHours = (range.end - range.start) / HOUR_MILLISECONDS;
		let stepHours = 12;
		if (spanHours <= 8) {
			stepHours = 1;
		} else if (spanHours <= 30) {
			stepHours = 3;
		} else if (spanHours <= 72) {
			stepHours = 6;
		}
		const ticks = [];
		const firstTick = Math.ceil(range.start / (stepHours * HOUR_MILLISECONDS)) * stepHours * HOUR_MILLISECONDS;
		for (let time = firstTick; time <= range.end; time += stepHours * HOUR_MILLISECONDS) {
			const date = new Date(time);
			const x = MARGIN_LEFT + ((time - range.start) / (range.end - range.start)) * plotWidth;
			const isMidnight = date.getUTCHours() === 0;
			const dayLabel = HtmlText.formatDay(date.toISOString().slice(0, 10)).slice(0, 6);
			const isFirst = ticks.length === 0;
			const timeLabel = HtmlText.formatTime(date.toISOString());
			const label = isMidnight === true ? dayLabel : (isFirst === true ? `${dayLabel} ${timeLabel}` : timeLabel);
			ticks.push(/* html */`
				<line class="grid ${isMidnight === true ? 'is-midnight' : ''}" x1="${x}" x2="${x}"
					y1="${AXIS_HEIGHT - 6}" y2="${height}"></line>
				<text x="${x}" y="${AXIS_HEIGHT - 12}" text-anchor="middle">${HtmlText.escape(label)}</text>
			`);
		}
		const htmlContent = /* html */`
			<text x="8" y="${AXIS_HEIGHT - 12}" class="axis-title">Time in UTC</text>
			${ticks.join('')}
		`;
		return htmlContent;
	}

	/**
	 * Draws the band and the label of one lane.
	 *
	 * @param {{ kind: string, top: number, height: number, marks: Record<string, any>[] }} lane - A lane.
	 * @returns {string} The SVG markup.
	 */
	static _laneHtml(lane) {
		const label = `${KIND_LABELS[lane.kind]} (${lane.marks.length})`;
		const htmlContent = /* html */`
			<rect class="lane-band" x="0" y="${lane.top}" width="${WIDTH}" height="${lane.height}"
				${lane.kind === 'issue' || lane.kind === 'commit' ? '' : 'fill-opacity="0"'}></rect>
			<text class="lane-label" x="8" y="${lane.top + lane.height / 2 + 4}">${HtmlText.escape(label)}</text>
		`;
		return htmlContent;
	}

	/**
	 * Draws a curve from the selected record to each record linked to it.
	 *
	 * @param {string | null} selectedKey - The key of the selected record.
	 * @param {Set<string>} linkedKeys - The keys of the linked records.
	 * @param {Map<string, Record<string, any>>} positions - The mark of each drawn record, by key.
	 * @returns {string} The SVG markup.
	 */
	static _linkHtml(selectedKey, linkedKeys, positions) {
		const origin = selectedKey === null ? undefined : positions.get(selectedKey);
		if (origin === undefined) {
			return '';
		}
		const curves = [];
		for (const linkedKey of linkedKeys) {
			const target = positions.get(linkedKey);
			if (target !== undefined) {
				const middleY = (origin.y + target.y) / 2;
				curves.push(/* html */`
					<path class="link-line"
						d="M ${origin.x} ${origin.y} C ${origin.x} ${middleY}, ${target.x} ${middleY}, ${target.x} ${target.y}"></path>
				`);
			}
		}
		return curves.join('');
	}

	/**
	 * Draws the mark of one record. The shape tells the kind: circle, square, triangle, or diamond.
	 *
	 * @param {Record<string, any>} mark - The place of a record.
	 * @param {string | null} selectedKey - The key of the selected record.
	 * @param {Set<string>} linkedKeys - The keys of the records linked to the selected record.
	 * @returns {string} The SVG markup.
	 */
	static _markHtml(mark, selectedKey, linkedKeys) {
		const event = mark.event;
		const classes = ['mark', `is-${event.kind}`];
		if (event.isMerge === true) {
			classes.push('is-merge');
		}
		if (event.isDirect === false) {
			classes.push('is-indirect');
		}
		if (event.key === selectedKey) {
			classes.push('is-selected');
		} else if (linkedKeys.has(event.key) === true) {
			classes.push('is-related');
		}
		const attributes = `class="${classes.join(' ')}" data-key="${HtmlText.escape(event.key)}" tabindex="0" role="button"
			aria-label="${HtmlText.escape(`${KIND_NAMES[event.kind]}: ${event.title}`)}"`;
		const { x, y, radius } = mark;
		if (event.kind === 'commit') {
			return /* html */`<circle ${attributes} cx="${x}" cy="${y}" r="${radius}"></circle>`;
		}
		if (event.kind === 'pull_request') {
			return /* html */`<rect ${attributes} x="${x - radius}" y="${y - radius}"
				width="${radius * 2}" height="${radius * 2}" rx="1.5"></rect>`;
		}
		const points = event.kind === 'issue'
			? `${x},${y - radius - 1} ${x + radius + 1},${y + radius} ${x - radius - 1},${y + radius}`
			: `${x},${y - radius - 1.5} ${x + radius + 1.5},${y} ${x},${y + radius + 1.5} ${x - radius - 1.5},${y}`;
		return /* html */`<polygon ${attributes} points="${points}"></polygon>`;
	}

	/**
	 * Selects the record under a click.
	 *
	 * @param {MouseEvent} event - The click.
	 */
	_handleClick(event) {
		const mark = event.target.closest('[data-key]');
		if (mark !== null) {
			this.onSelect(mark.dataset.key);
		}
	}

	/**
	 * Selects the focused record when the reader presses Enter or the space key.
	 *
	 * @param {KeyboardEvent} event - The key press.
	 */
	_handleKeydown(event) {
		const mark = event.target.closest('[data-key]');
		if (mark !== null && (event.key === 'Enter' || event.key === ' ')) {
			event.preventDefault();
			this.onSelect(mark.dataset.key);
		}
	}

	/**
	 * Shows the tooltip of the record under the pointer, or hides it.
	 *
	 * @param {MouseEvent} event - The pointer move.
	 */
	_handleMove(event) {
		const mark = event.target.closest('[data-key]');
		if (mark === null) {
			this.tooltip.hidden = true;
			return;
		}
		const box = this.container.parentElement.getBoundingClientRect();
		this.tooltip.textContent = this.describe(mark.dataset.key);
		this.tooltip.hidden = false;
		this.tooltip.style.left = `${Math.min(event.clientX - box.left + 14, box.width - 380)}px`;
		this.tooltip.style.top = `${event.clientY - box.top + 18}px`;
	}
}
