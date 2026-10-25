///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
//	CalendarMetrics — switches the daily measure shown in all repository calendars
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

class CalendarMetrics {
	static start() {
		CalendarMetrics.data = JSON.parse(document.getElementById('calendar-data').textContent);
		document.getElementById('metric').addEventListener('change', () => CalendarMetrics.render());
		CalendarMetrics.render();
	}

	static render() {
		const metric = document.getElementById('metric').value;
		const definition = CalendarMetrics.data.metrics[metric];
		const repositories = CalendarMetrics.data.repositories;
		const values = repositories.flatMap(repository => Object.values(repository.daily)
			.map(day => day[metric]).filter(value => value !== null && value > 0));
		const maximum = Math.max(1, ...values);
		const thresholds = [maximum / 4, maximum / 2, maximum * 3 / 4];
		document.getElementById('calculation').textContent = definition.description;
		for (const [index, repository] of repositories.entries()) {
			const section = document.getElementById(`repository-${index}`);
			const isAvailable = repository.available[metric];
			const days = Object.values(repository.daily);
			const total = days.reduce((sum, day) => sum + (day[metric] ?? 0), 0);
			const unpriced = days.reduce((sum, day) => sum + day.unpricedRows, 0);
			const isPartial = metric === 'cost' && unpriced > 0;
			const summary = section.querySelector('.total');
			summary.textContent = isAvailable === false ? 'Data unavailable in this snapshot' :
				`${CalendarMetrics.format(total, metric)} ${definition.unit}${isPartial ? ' · partial estimate' : ''}`;
			section.querySelector('.coverage').textContent = repository.coverage[metric];
			for (const square of section.querySelectorAll('rect[data-day]')) {
				const day = repository.daily[square.dataset.day];
				const value = day[metric];
				const isUnknown = isAvailable === false || value === null;
				const level = value === 0 ? 0 : value <= thresholds[0] ? 1 :
					value <= thresholds[1] ? 2 : value <= thresholds[2] ? 3 : 4;
				square.setAttribute('fill', isUnknown ? '#30363d' : CalendarMetrics.data.colors[level]);
				const partial = metric === 'cost' && day.unpricedRows > 0 ?
					` · partial: ${day.unpricedRows} usage records have no model price` : '';
				const valueLabel = isUnknown ? 'data unavailable' :
					`${CalendarMetrics.format(value, metric)} ${definition.unit}${partial}`;
				let label = `${square.dataset.day}: ${valueLabel}`;
				if (metric === 'lines' && isUnknown === false) {
					label += ` (${day.added.toLocaleString('en-US')} added + ` +
						`${day.removed.toLocaleString('en-US')} removed)`;
				}
				square.setAttribute('aria-label', label);
				square.querySelector('title').textContent = label;
			}
		}
		const legend = document.getElementById('legend');
		legend.replaceChildren();
		const labels = ['0', ...thresholds.map(value => `≤ ${CalendarMetrics.format(value, metric, true)}`),
			`> ${CalendarMetrics.format(thresholds[2], metric, true)}`, 'Unavailable'];
		for (const [index, label] of labels.entries()) {
			const item = document.createElement('span');
			const swatch = document.createElement('i');
			swatch.style.background = index === 5 ? '#30363d' : CalendarMetrics.data.colors[index];
			item.append(swatch, document.createTextNode(label));
			legend.append(item);
		}
	}

	static format(value, metric, isThreshold = false) {
		return value.toLocaleString('en-US', {
			maximumFractionDigits: metric === 'cost' || isThreshold === true ? 2 : 0,
			minimumFractionDigits: metric === 'cost' ? 2 : 0,
		});
	}
}

CalendarMetrics.start();
