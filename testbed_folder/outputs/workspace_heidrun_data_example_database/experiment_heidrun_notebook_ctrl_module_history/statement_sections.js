import { HtmlText } from './html_text.js';

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
//	StatementSections — writes the statements of the sections, each with its status and its sources
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

const STATUS_LABELS = {
	fact: 'Recorded fact',
	unknown: 'Unknown',
	interpretation: 'Interpretation',
};

export class StatementSections {
	/**
	 * Connects the writer to the store.
	 *
	 * @param {import('./module_history_store.js').ModuleHistoryStore} store - The records and the statements.
	 */
	constructor(store) {
		/** The records and the statements. */
		this.store = store;
	}

	/**
	 * Writes a list of statements.
	 *
	 * @param {Record<string, any>[]} statements - The statements.
	 * @returns {string} The HTML of the list.
	 */
	listHtml(statements) {
		const items = statements.map((statement) => {
			return this.statementHtml(statement);
		}).join('');
		const htmlContent = /* html */`<ul class="statements">${items}</ul>`;
		return htmlContent;
	}

	/**
	 * Writes one statement with its status badge and its sources.
	 *
	 * @param {Record<string, any>} statement - The statement.
	 * @returns {string} The HTML of the statement.
	 */
	statementHtml(statement) {
		const titleHtmlContent = statement.title === undefined ? '' : /* html */`
			<strong>${HtmlText.escape(statement.title)}.</strong>
		`;
		const htmlContent = /* html */`
			<li class="statement is-${statement.status}">
				<p><span class="badge is-${statement.status}">${STATUS_LABELS[statement.status]}</span>
					${titleHtmlContent}${HtmlText.escape(statement.text)}</p>
				${this._sourcesHtml(statement.sources)}
			</li>
		`;
		return htmlContent;
	}

	/**
	 * Writes the cards of the decisions.
	 *
	 * @param {Record<string, any>[]} decisions - The decisions.
	 * @returns {string} The HTML of the cards.
	 */
	decisionsHtml(decisions) {
		return decisions.map((decision, index) => {
			return this._decisionHtml(decision, index === 0);
		}).join('');
	}

	/**
	 * Writes one decision as a card that opens and closes.
	 *
	 * @param {Record<string, any>} decision - The decision.
	 * @param {boolean} isOpen - True to open the card.
	 * @returns {string} The HTML of the card.
	 */
	_decisionHtml(decision, isOpen) {
		const parts = decision.parts.map((part) => {
			return /* html */`
				<h4>${HtmlText.escape(part.label)}</h4>
				${this.listHtml(part.statements)}
			`;
		}).join('');
		const htmlContent = /* html */`
			<details class="decision" id="decision-${HtmlText.escape(decision.id)}" ${isOpen ? 'open' : ''}>
				<summary>${HtmlText.escape(decision.title)}<small>${HtmlText.escape(decision.question)}</small></summary>
				<div class="decision-body">${parts}</div>
			</details>
		`;
		return htmlContent;
	}

	/**
	 * Writes the sources of a statement: a link for each record, and the quote when there is one.
	 *
	 * @param {Record<string, any>[]} sources - The sources.
	 * @returns {string} The HTML of the sources.
	 */
	_sourcesHtml(sources) {
		const items = sources.map((source) => {
			const label = this.store.sourceLabel(source);
			const url = this.store.sourceUrl(source);
			const linkHtmlContent = url === null
				? /* html */`<span title="A chat session has no address on GitHub">${HtmlText.escape(label)}</span>`
				: /* html */`<a href="${HtmlText.escape(url)}" target="_blank" rel="noopener">${HtmlText.escape(label)}</a>`;
			const quoteHtmlContent = source.quote === undefined ? '' : /* html */`
				<blockquote>“${HtmlText.escape(source.quote)}”</blockquote>
			`;
			const htmlContent = /* html */`<li>${linkHtmlContent}${quoteHtmlContent}</li>`;
			return htmlContent;
		}).join('');
		const htmlContent = /* html */`
			<details class="sources">
				<summary>${HtmlText.count(sources.length, 'source', 'sources')}</summary>
				<ul>${items}</ul>
			</details>
		`;
		return htmlContent;
	}
}
