///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
//	HtmlText — escapes text and formats dates for the page of this experiment
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export class HtmlText {
	/**
	 * Escapes a value so that it is safe inside HTML text and inside a quoted HTML attribute.
	 *
	 * @param {unknown} value - The value to escape.
	 * @returns {string} The escaped text.
	 */
	static escape(value) {
		return String(value)
			.replaceAll('&', '&amp;')
			.replaceAll('<', '&lt;')
			.replaceAll('>', '&gt;')
			.replaceAll('"', '&quot;')
			.replaceAll('\'', '&#39;');
	}

	/**
	 * Formats a date as day, month, and time in UTC, for example `20 Oct 14:06`.
	 *
	 * @param {string} isoString - A date in the ISO 8601 format.
	 * @returns {string} The short text.
	 */
	static formatShort(isoString) {
		const date = new Date(isoString);
		const monthName = MONTH_NAMES[date.getUTCMonth()];
		return `${date.getUTCDate()} ${monthName} ${HtmlText.formatTime(isoString)}`;
	}

	/**
	 * Formats a date with the year, the time, and the word UTC, for example `20 Oct 2026 14:06 UTC`.
	 *
	 * @param {string} isoString - A date in the ISO 8601 format.
	 * @returns {string} The long text.
	 */
	static formatLong(isoString) {
		const date = new Date(isoString);
		const monthName = MONTH_NAMES[date.getUTCMonth()];
		return `${date.getUTCDate()} ${monthName} ${date.getUTCFullYear()} ${HtmlText.formatTime(isoString)} UTC`;
	}

	/**
	 * Formats the time of a date in UTC, for example `14:06`.
	 *
	 * @param {string} isoString - A date in the ISO 8601 format.
	 * @returns {string} The time text.
	 */
	static formatTime(isoString) {
		const date = new Date(isoString);
		return `${HtmlText._twoDigits(date.getUTCHours())}:${HtmlText._twoDigits(date.getUTCMinutes())}`;
	}

	/**
	 * Formats the day of a date, for example `20 Oct 2026`.
	 *
	 * @param {string} dayKey - A day written as `YYYY-MM-DD`.
	 * @returns {string} The day text.
	 */
	static formatDay(dayKey) {
		const date = new Date(`${dayKey}T00:00:00Z`);
		return `${date.getUTCDate()} ${MONTH_NAMES[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
	}

	/**
	 * Cuts a text to a maximum length and adds an ellipsis when the text is longer.
	 *
	 * @param {string} text - The text to cut.
	 * @param {number} maximumLength - The maximum number of characters.
	 * @returns {string} The cut text.
	 */
	static truncate(text, maximumLength) {
		if (text.length <= maximumLength) {
			return text;
		}
		return `${text.slice(0, maximumLength).trimEnd()}…`;
	}

	/**
	 * Writes a count with the singular or the plural form of a noun.
	 *
	 * @param {number} count - The count.
	 * @param {string} singular - The noun for one.
	 * @param {string} plural - The noun for any other count.
	 * @returns {string} The count and the noun.
	 */
	static count(count, singular, plural) {
		return `${count} ${count === 1 ? singular : plural}`;
	}

	/**
	 * Pads a number to two digits.
	 *
	 * @param {number} value - The number.
	 * @returns {string} The padded text.
	 */
	static _twoDigits(value) {
		return String(value).padStart(2, '0');
	}
}
