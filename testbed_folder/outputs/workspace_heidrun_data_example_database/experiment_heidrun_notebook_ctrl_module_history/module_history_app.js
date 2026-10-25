import { HtmlText } from './html_text.js';
import { ModuleHistoryStore } from './module_history_store.js';
import { OverviewSections } from './overview_sections.js';
import { StatementSections } from './statement_sections.js';
import { TimelineSection } from './timeline_section.js';

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
//	ModuleHistoryApp — loads the records and fills the sections of index.html
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

export class ModuleHistoryApp {
	/**
	 * Loads the records, then fills every section of the page.
	 *
	 * @returns {Promise<void>} Resolves when the page is filled.
	 */
	static async start() {
		let store;
		try {
			store = await ModuleHistoryStore.load();
		} catch (error) {
			ModuleHistoryApp._showLoadError(error);
			return;
		}
		const statementSections = new StatementSections(store);
		const overviewSections = new OverviewSections(store, statementSections);
		const statements = store.statements;
		const summaryHtmlContent = overviewSections.countsHtml() + statementSections.listHtml(statements.summary);
		ModuleHistoryApp._fill('summary-content', summaryHtmlContent);
		ModuleHistoryApp._fill('origin-content', statementSections.listHtml(statements.origin));
		const timeline = new TimelineSection(store, document.getElementById('timeline-content'));
		ModuleHistoryApp._fill('files-content', overviewSections.filesHtml());
		ModuleHistoryApp._fill('decisions-content', statementSections.decisionsHtml(statements.decisions));
		ModuleHistoryApp._fill('constraints-content', statementSections.listHtml(statements.constraints));
		ModuleHistoryApp._fill('attempts-content', statementSections.listHtml(statements.attempts));
		ModuleHistoryApp._fill('relationships-content', overviewSections.relationshipsHtml());
		ModuleHistoryApp._fill('questions-content', statementSections.listHtml(statements.openQuestions));
		ModuleHistoryApp._fill('method-content', overviewSections.methodHtml());
		document.getElementById('files-content').addEventListener('click', (event) => {
			const button = event.target.closest('[data-action="filter-file"]');
			if (button !== null) {
				timeline.setFileFilter(button.dataset.path);
				document.getElementById('timeline').scrollIntoView();
			}
		});
		document.getElementById('data-date').textContent = HtmlText.formatLong(store.data.generatedAt);
	}

	/**
	 * Writes the HTML of one part of the page.
	 *
	 * @param {string} elementId - The identifier of the element.
	 * @param {string} htmlContent - The HTML to write.
	 */
	static _fill(elementId, htmlContent) {
		document.getElementById(elementId).innerHTML = htmlContent;
	}

	/**
	 * Tells the reader that the data files did not load, and how to open the page.
	 *
	 * @param {unknown} error - The error of the load.
	 */
	static _showLoadError(error) {
		const message = error instanceof Error ? error.message : String(error);
		const address = 'http://127.0.0.1:8765/workspace_heidrun_data_example_database/'
			+ 'experiment_heidrun_notebook_ctrl_module_history/index.html';
		const htmlContent = /* html */`
			<div class="error-box">
				<strong>The data files did not load.</strong>
				<p>${HtmlText.escape(message)}</p>
				<p>A page opened as a local file cannot load its data files. Start the local server from the folder
					<code>testbed_folder/</code> with <code>python3 outputs/serve_outputs.py</code>, then open
					<a href="${address}">this page through the local server</a>.</p>
			</div>
		`;
		document.querySelector('main').innerHTML = htmlContent;
	}
}

ModuleHistoryApp.start();
