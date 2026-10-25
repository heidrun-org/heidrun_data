import { HtmlText } from './html_text.js';

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
//	ModuleHistoryStore — loads the records and answers the questions of the page
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

/**
 * @typedef {'commit' | 'pull_request' | 'issue' | 'chat_session'} EventKind
 */

/**
 * One record of the timeline.
 *
 * @typedef {object} TimelineEvent
 * @property {string} key - The kind and the identifier, for example `issue:23`.
 * @property {EventKind} kind - The kind of record.
 * @property {string} at - The date of the record in the ISO 8601 format.
 * @property {string} title - The title of the record.
 * @property {string | null} url - The address of the record on GitHub, or null for a chat session.
 * @property {boolean} isDirect - True when the record is directly about the package.
 * @property {boolean} isMerge - True for a merge commit.
 * @property {number} size - The lines changed in the package, for a commit; zero for any other record.
 * @property {Record<string, any>} record - The record as collected by `heidrun_data`.
 */

/**
 * The filter of the timeline.
 *
 * @typedef {object} TimelineFilter
 * @property {Set<EventKind>} kinds - The kinds of record to show.
 * @property {boolean} showMerges - True to show the merge commits.
 * @property {boolean} onlyDirect - True to hide the records that only mention the package.
 * @property {string | null} dayKey - A day written as `YYYY-MM-DD`, or null for every day.
 * @property {string} searchText - Text that the title or the body of a record must hold.
 * @property {string | null} filePath - A path in the package that a commit must change, or null.
 */

export const EVENT_KINDS = ['commit', 'pull_request', 'issue', 'chat_session'];

export const KIND_LABELS = {
	commit: 'Commits',
	pull_request: 'Pull requests',
	issue: 'Issues',
	chat_session: 'Chat sessions',
};

export const KIND_NAMES = {
	commit: 'Commit',
	pull_request: 'Pull request',
	issue: 'Issue',
	chat_session: 'Chat session',
};

export class ModuleHistoryStore {
	/**
	 * Builds the store from the three files of the experiment.
	 *
	 * @param {Record<string, any>} data - The content of module_history_data.json.
	 * @param {Record<string, any>} statements - The content of module_history_statements.json.
	 * @param {Record<string, any>} verification - The content of module_history_verification.json.
	 */
	constructor(data, statements, verification) {
		/** The records collected with `heidrun_data`. */
		this.data = data;
		/** The statements of the sections, each with its sources. */
		this.statements = statements;
		/** The result of the check of every source and quote. */
		this.verification = verification;
		/** @type {TimelineEvent[]} The records of the timeline, oldest first. */
		this.events = this._buildEvents();
		/** @type {Map<string, TimelineEvent>} The records by key. */
		this.eventsByKey = new Map();
		for (const event of this.events) {
			this.eventsByKey.set(event.key, event);
		}
		/** @type {Map<string, Set<string>>} The keys of the linked records, by key. */
		this.links = this._buildLinks();
	}

	/**
	 * Loads the three files of the experiment.
	 *
	 * @returns {Promise<ModuleHistoryStore>} The store.
	 */
	static async load() {
		const [data, statements, verification] = await Promise.all([
			ModuleHistoryStore._fetchJson('module_history_data.json'),
			ModuleHistoryStore._fetchJson('module_history_statements.json'),
			ModuleHistoryStore._fetchJson('module_history_verification.json'),
		]);
		return new ModuleHistoryStore(data, statements, verification);
	}

	/**
	 * Returns the keys of the records linked to a record.
	 *
	 * @param {string | null} key - The key of a record.
	 * @returns {Set<string>} The keys of the linked records, empty when the key is null.
	 */
	getLinkedKeys(key) {
		if (key === null) {
			return new Set();
		}
		return this.links.get(key) ?? new Set();
	}

	/**
	 * Returns the days that hold at least one record, with the number of records of each day.
	 *
	 * @returns {{ dayKey: string, count: number }[]} The days, oldest first.
	 */
	getDays() {
		/** @type {Map<string, number>} */
		const counts = new Map();
		for (const event of this.events) {
			const dayKey = event.at.slice(0, 10);
			counts.set(dayKey, (counts.get(dayKey) ?? 0) + 1);
		}
		return [...counts.entries()].map(([dayKey, count]) => {
			return {
				dayKey: dayKey,
				count: count,
			};
		});
	}

	/**
	 * Returns the records that pass a filter.
	 *
	 * @param {TimelineFilter} filter - The filter.
	 * @returns {TimelineEvent[]} The records, oldest first.
	 */
	filterEvents(filter) {
		const searchText = filter.searchText.trim().toLowerCase();
		const fileKeys = filter.filePath === null ? null : this._keysForFile(filter.filePath);
		return this.events.filter((event) => {
			if (filter.kinds.has(event.kind) === false) {
				return false;
			}
			if (event.isMerge === true && filter.showMerges === false) {
				return false;
			}
			if (filter.onlyDirect === true && event.isDirect === false) {
				return false;
			}
			if (filter.dayKey !== null && event.at.slice(0, 10) !== filter.dayKey) {
				return false;
			}
			if (fileKeys !== null && fileKeys.has(event.key) === false) {
				return false;
			}
			if (searchText !== '' && this._searchableText(event).includes(searchText) === false) {
				return false;
			}
			return true;
		});
	}

	/**
	 * Finds the full hash of a commit from the start of the hash.
	 *
	 * @param {string} prefix - The first characters of the hash.
	 * @returns {string} The full hash, or the prefix when no collected commit starts with it.
	 */
	fullHash(prefix) {
		const commit = this.data.commits.find((candidate) => {
			return candidate.hash.startsWith(prefix);
		});
		return commit === undefined ? prefix : commit.hash;
	}

	/**
	 * Returns the address on GitHub of the record that a source names.
	 *
	 * @param {Record<string, any>} source - A source of a statement.
	 * @returns {string | null} The address, or null for a chat session.
	 */
	sourceUrl(source) {
		const base = this.data.githubBase;
		if (source.kind === 'issue') {
			return `${base}/issues/${source.id}`;
		}
		if (source.kind === 'pull_request') {
			return `${base}/pull/${source.id}`;
		}
		if (source.kind === 'commit') {
			return `${base}/commit/${this.fullHash(source.id)}`;
		}
		return null;
	}

	/**
	 * Writes the short link text of a source, for example `issue 23, comment of 20 Oct 17:24 UTC`.
	 *
	 * @param {Record<string, any>} source - A source of a statement.
	 * @returns {string} The link text.
	 */
	sourceLabel(source) {
		const kindNames = {
			issue: 'issue',
			pull_request: 'pull request',
			commit: 'commit',
			chat_session: 'chat session',
		};
		const name = kindNames[source.kind];
		const identifier = source.kind === 'chat_session' ? String(source.id).slice(0, 8) : source.id;
		if (source.part === 'comment') {
			return `${name} ${identifier}, comment of ${HtmlText.formatShort(source.at)} UTC`;
		}
		if (source.part === 'fields') {
			return `${name} ${identifier}, state`;
		}
		if (source.part === 'diff') {
			return `${name} ${identifier}, changes`;
		}
		return `${name} ${identifier}`;
	}

	/**
	 * Builds the records of the timeline from the collected data.
	 *
	 * @returns {TimelineEvent[]} The records, oldest first.
	 */
	_buildEvents() {
		const githubBase = this.data.githubBase;
		/** @type {TimelineEvent[]} */
		const events = [];
		for (const commit of this.data.commits) {
			events.push({
				key: `commit:${commit.hash}`,
				kind: 'commit',
				at: commit.at,
				title: commit.subject,
				url: `${githubBase}/commit/${commit.hash}`,
				isDirect: true,
				isMerge: commit.isMerge,
				size: commit.packageFiles.reduce((total, file) => {
					return total + file.insertions + file.deletions;
				}, 0),
				record: commit,
			});
		}
		for (const pullRequest of this.data.pullRequests) {
			events.push({
				key: `pull_request:${pullRequest.number}`,
				kind: 'pull_request',
				at: pullRequest.mergedAt ?? pullRequest.createdAt,
				title: `Pull request ${pullRequest.number}: ${pullRequest.title}`,
				url: `${githubBase}/pull/${pullRequest.number}`,
				isDirect: pullRequest.isDirect,
				isMerge: false,
				size: 0,
				record: pullRequest,
			});
		}
		for (const issue of this.data.issues) {
			events.push({
				key: `issue:${issue.number}`,
				kind: 'issue',
				at: issue.createdAt,
				title: `Issue ${issue.number}: ${issue.title}`,
				url: `${githubBase}/issues/${issue.number}`,
				isDirect: issue.isDirect,
				isMerge: false,
				size: 0,
				record: issue,
			});
		}
		for (const chatSession of this.data.chatSessions) {
			events.push({
				key: `chat_session:${chatSession.id}`,
				kind: 'chat_session',
				at: chatSession.firstRecordAt,
				title: chatSession.title,
				url: null,
				isDirect: chatSession.isDirect,
				isMerge: false,
				size: 0,
				record: chatSession,
			});
		}
		return events.sort((left, right) => {
			return left.at.localeCompare(right.at) || left.key.localeCompare(right.key);
		});
	}

	/**
	 * Links the records that refer to each other.
	 *
	 * @returns {Map<string, Set<string>>} The keys of the linked records, by key.
	 */
	_buildLinks() {
		/** @type {Map<string, Set<string>>} */
		const links = new Map();
		for (const commit of this.data.commits) {
			const commitKey = `commit:${commit.hash}`;
			if (commit.pullRequestNumber !== null) {
				this._connect(links, commitKey, `pull_request:${commit.pullRequestNumber}`);
			}
			for (const reference of commit.referencedNumbers) {
				this._connect(links, commitKey, this._numberKey(reference.number));
			}
		}
		for (const pullRequest of this.data.pullRequests) {
			const pullRequestKey = `pull_request:${pullRequest.number}`;
			this._connect(links, pullRequestKey, `commit:${pullRequest.mergeCommit}`);
			for (const reference of pullRequest.referencedNumbers) {
				if (reference.verb === 'fixes' || reference.verb === 'part of') {
					this._connect(links, pullRequestKey, this._numberKey(reference.number));
				}
			}
		}
		for (const chatSession of this.data.chatSessions) {
			for (const reason of chatSession.reasons) {
				if (reason.type === 'issue' || reason.type === 'pull_request') {
					this._connect(links, `chat_session:${chatSession.id}`, `${reason.type}:${reason.number}`);
				}
			}
		}
		return links;
	}

	/**
	 * Returns the key of the issue or of the pull request that has a number.
	 *
	 * @param {number} number - The number.
	 * @returns {string} The key of the issue when it exists, else the key of the pull request.
	 */
	_numberKey(number) {
		return this.eventsByKey.has(`issue:${number}`) ? `issue:${number}` : `pull_request:${number}`;
	}

	/**
	 * Links two records in both directions when both exist.
	 *
	 * @param {Map<string, Set<string>>} links - The links to extend.
	 * @param {string} keyA - The key of the first record.
	 * @param {string} keyB - The key of the second record.
	 */
	_connect(links, keyA, keyB) {
		if (this.eventsByKey.has(keyA) === false || this.eventsByKey.has(keyB) === false || keyA === keyB) {
			return;
		}
		if (links.has(keyA) === false) {
			links.set(keyA, new Set());
		}
		if (links.has(keyB) === false) {
			links.set(keyB, new Set());
		}
		links.get(keyA).add(keyB);
		links.get(keyB).add(keyA);
	}

	/**
	 * Returns the keys of the commits that change a file of the package, and of the records linked to them.
	 *
	 * @param {string} filePath - A path inside the package.
	 * @returns {Set<string>} The keys.
	 */
	_keysForFile(filePath) {
		const prefix = `packages/${this.data.module}/`;
		const keys = new Set();
		for (const commit of this.data.commits) {
			const touchesFile = commit.packageFiles.some((file) => {
				return file.path === `${prefix}${filePath}`;
			});
			if (touchesFile === true) {
				const commitKey = `commit:${commit.hash}`;
				keys.add(commitKey);
				for (const linkedKey of this.getLinkedKeys(commitKey)) {
					keys.add(linkedKey);
				}
			}
		}
		return keys;
	}

	/**
	 * Returns the lower case text that a search looks in.
	 *
	 * @param {TimelineEvent} event - A record.
	 * @returns {string} The title and the body of the record.
	 */
	_searchableText(event) {
		const body = event.record.body ?? '';
		return `${event.title} ${body}`.toLowerCase();
	}

	/**
	 * Fetches one JSON file next to the page.
	 *
	 * @param {string} fileName - The name of the file.
	 * @returns {Promise<Record<string, any>>} The parsed content.
	 */
	static async _fetchJson(fileName) {
		const response = await fetch(fileName, {
			cache: 'no-store',
		});
		if (response.ok === false) {
			throw new Error(`The file ${fileName} answered ${response.status}.`);
		}
		return response.json();
	}
}
