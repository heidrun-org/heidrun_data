import * as Three from '__THREE__';
import * as Controls from '__CONTROLS__';

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
//	ActivityRelationships3d — explores daily activity supplied by heidrun_data
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

class ActivityRelationships3d {
	static start() {
		ActivityRelationships3d.data = JSON.parse(document.getElementById('activity-data').textContent);
		ActivityRelationships3d.points = [];
		ActivityRelationships3d.labels = [];
		ActivityRelationships3d.selection = null;
		ActivityRelationships3d.scene = new Three.Scene();
		ActivityRelationships3d.scene.background = new Three.Color('#0d1117');
		ActivityRelationships3d.camera = new Three.PerspectiveCamera(45, 1, 0.1, 100);
		ActivityRelationships3d.camera.position.set(17, 14, 20);
		try {
			ActivityRelationships3d.renderer = new Three.WebGLRenderer({
				antialias: true,
			});
		} catch {
			document.getElementById('status').textContent =
				'3D rendering is unavailable in this browser. The daily data table below remains available.';
			document.getElementById('viewport').hidden = true;
			return;
		}
		const renderer = ActivityRelationships3d.renderer;
		renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
		const viewport = document.getElementById('viewport');
		viewport.append(renderer.domElement);
		ActivityRelationships3d.orbitControls = new Controls.OrbitControls(
			ActivityRelationships3d.camera, renderer.domElement,
		);
		ActivityRelationships3d.orbitControls.target.set(5, 4, 5);
		ActivityRelationships3d.orbitControls.enableDamping = true;
		ActivityRelationships3d.orbitControls.minDistance = 5;
		ActivityRelationships3d.orbitControls.maxDistance = 60;
		ActivityRelationships3d.raycaster = new Three.Raycaster();
		ActivityRelationships3d.pointer = new Three.Vector2(-10, -10);
		ActivityRelationships3d.scene.add(new Three.GridHelper(10, 10, '#46536a', '#263044'));
		ActivityRelationships3d.scene.children[0].position.set(5, 0, 5);
		for (const id of ['x-axis', 'y-axis', 'z-axis', 'scale', 'date-from', 'date-to']) {
			document.getElementById(id).addEventListener('change', () => ActivityRelationships3d.update());
		}
		for (const checkbox of document.querySelectorAll('[data-repository]')) {
			checkbox.addEventListener('change', () => ActivityRelationships3d.update());
		}
		document.getElementById('reset').addEventListener('click', () => {
			ActivityRelationships3d.camera.position.set(17, 14, 20);
			ActivityRelationships3d.orbitControls.target.set(5, 4, 5);
		});
		renderer.domElement.addEventListener('pointermove', event => {
			const bounds = renderer.domElement.getBoundingClientRect();
			ActivityRelationships3d.pointer.set(
				(event.clientX - bounds.left) / bounds.width * 2 - 1,
				-(event.clientY - bounds.top) / bounds.height * 2 + 1,
			);
		});
		renderer.domElement.addEventListener('pointerleave', () => {
			ActivityRelationships3d.pointer.set(-10, -10);
		});
		new ResizeObserver(() => ActivityRelationships3d.resize()).observe(viewport);
		ActivityRelationships3d.update();
		ActivityRelationships3d.resize();
		renderer.setAnimationLoop(() => {
			ActivityRelationships3d.orbitControls.update();
			ActivityRelationships3d.inspect();
			renderer.render(ActivityRelationships3d.scene, ActivityRelationships3d.camera);
		});
	}

	static update() {
		for (const object of [...ActivityRelationships3d.points, ...ActivityRelationships3d.labels]) {
			ActivityRelationships3d.scene.remove(object);
			object.geometry?.dispose();
			object.material?.map?.dispose();
			object.material?.dispose();
		}
		ActivityRelationships3d.points = [];
		ActivityRelationships3d.labels = [];
		ActivityRelationships3d.selection = null;
		const axes = ['x', 'y', 'z'].map(axis => document.getElementById(`${axis}-axis`).value);
		const from = document.getElementById('date-from').value;
		const to = document.getElementById('date-to').value;
		if (from > to) {
			document.getElementById('status').textContent = 'Choose a start date on or before the end date.';
			return;
		}
		const isLogarithmic = document.getElementById('scale').value === 'log';
		const records = [];
		let missing = 0;
		for (const [index, repository] of ActivityRelationships3d.data.repositories.entries()) {
			if (document.getElementById(`show-${index}`).checked === false) {
				continue;
			}
			for (const [date, day] of Object.entries(repository.daily)) {
				if (date < from || date > to) {
					continue;
				}
				const isActive = [day.commits, day.pullRequests, day.tokens].some(value => value > 0);
				if (isActive === false) {
					continue;
				}
				const isMissing = axes.some(metric => repository.available[metric] === false ||
					day[metric] === null || (metric === 'cost' && day.unpricedRows > 0));
				if (isMissing === true) {
					missing += 1;
					continue;
				}
				records.push({
					date,
					day,
					repository: repository.name,
					color: ['#ff6b76', '#64b5ff', '#edc56b'][index],
				});
			}
		}
		const maxima = axes.map(metric => Math.max(1, ...records.map(record => record.day[metric])));
		const endpoints = [new Three.Vector3(10, 0, 0), new Three.Vector3(0, 10, 0),
			new Three.Vector3(0, 0, 10)];
		for (const [index, metric] of axes.entries()) {
			const direction = endpoints[index].clone().normalize();
			const arrow = new Three.ArrowHelper(direction, new Three.Vector3(), 10, '#8b98b0', 0.3, 0.16);
			ActivityRelationships3d.scene.add(arrow);
			ActivityRelationships3d.labels.push(arrow);
			const title = ActivityRelationships3d.data.metrics[metric].label;
			ActivityRelationships3d.label(title, endpoints[index].clone().multiplyScalar(1.17), 3.3);
			for (let step = 0; step <= 4; step += 1) {
				const fraction = step / 4;
				const value = isLogarithmic ? Math.expm1(fraction * Math.log1p(maxima[index])) :
					fraction * maxima[index];
				const position = endpoints[index].clone().multiplyScalar(fraction);
				position.x -= index === 0 ? 0 : 0.45;
				position.y -= index === 1 ? 0 : 0.45;
				ActivityRelationships3d.label(ActivityRelationships3d.format(value, metric), position, 1.6);
			}
		}
		for (const record of records) {
			const coordinates = axes.map((metric, index) => {
				const value = record.day[metric];
				return 10 * (isLogarithmic ? Math.log1p(value) / Math.log1p(maxima[index]) :
					value / maxima[index]);
			});
			const sphere = new Three.Mesh(new Three.SphereGeometry(0.12, 16, 12),
				new Three.MeshBasicMaterial({
					color: record.color,
				}));
			sphere.position.set(...coordinates);
			sphere.userData = record;
			ActivityRelationships3d.scene.add(sphere);
			ActivityRelationships3d.points.push(sphere);
		}
		document.getElementById('status').textContent = `${records.length} daily points shown · ` +
			`${missing} active repository-days excluded because a selected measure is unavailable or unpriced. ` +
			`${isLogarithmic ? 'Logarithmic' : 'Linear'} axes; each axis uses its own unit.`;
		document.getElementById('details').textContent =
			'Hover over a point for its date and all five measures. The table below provides the same records.';
		ActivityRelationships3d.updateTable(records);
	}

	static resize() {
		const viewport = document.getElementById('viewport');
		const width = viewport.clientWidth;
		const height = viewport.clientHeight;
		if (width === 0 || height === 0) {
			return;
		}
		ActivityRelationships3d.camera.aspect = width / height;
		ActivityRelationships3d.camera.updateProjectionMatrix();
		ActivityRelationships3d.renderer.setSize(width, height);
	}

	static inspect() {
		ActivityRelationships3d.raycaster.setFromCamera(
			ActivityRelationships3d.pointer, ActivityRelationships3d.camera,
		);
		const hit = ActivityRelationships3d.raycaster.intersectObjects(ActivityRelationships3d.points)[0];
		const object = hit === undefined ? null : hit.object;
		if (object === ActivityRelationships3d.selection) {
			return;
		}
		if (ActivityRelationships3d.selection !== null) {
			ActivityRelationships3d.selection.scale.setScalar(1);
		}
		ActivityRelationships3d.selection = object;
		if (object === null) {
			return;
		}
		object.scale.setScalar(1.7);
		const record = object.userData;
		const values = Object.entries(ActivityRelationships3d.data.metrics).map(([metric, definition]) =>
			`${definition.label}: ${ActivityRelationships3d.formatDay(record.day, metric)}`);
		document.getElementById('details').textContent =
			`${record.repository} · ${record.date}\n${values.join('\n')}\n` +
			`${record.day.added.toLocaleString('en-US')} lines added + ` +
			`${record.day.removed.toLocaleString('en-US')} lines removed`;
	}

	static format(value, metric) {
		if (value === null) {
			return 'Unavailable';
		}
		return value.toLocaleString('en-US', {
			maximumFractionDigits: metric === 'cost' ? 2 : 0,
			minimumFractionDigits: metric === 'cost' ? 2 : 0,
		});
	}

	static formatDay(day, metric) {
		const label = ActivityRelationships3d.format(day[metric], metric);
		return metric === 'cost' && day.unpricedRows > 0 && day[metric] !== null ?
			`${label} (partial estimate)` : label;
	}

	static updateTable(records) {
		const body = document.getElementById('daily-records');
		body.replaceChildren();
		for (const record of records) {
			const row = document.createElement('tr');
			const values = [record.repository, record.date, ...Object.keys(ActivityRelationships3d.data.metrics)
				.map(metric => ActivityRelationships3d.formatDay(record.day, metric))];
			for (const value of values) {
				const cell = document.createElement('td');
				cell.textContent = value;
				row.append(cell);
			}
			body.append(row);
		}
	}

	static label(text, position, width) {
		const canvas = document.createElement('canvas');
		canvas.width = 768;
		canvas.height = 96;
		const context = canvas.getContext('2d');
		context.font = '30px system-ui';
		context.textAlign = 'center';
		context.textBaseline = 'middle';
		context.fillStyle = '#c4cede';
		context.fillText(text, 384, 48);
		const sprite = new Three.Sprite(new Three.SpriteMaterial({
			map: new Three.CanvasTexture(canvas),
			depthTest: false,
			transparent: true,
		}));
		sprite.position.copy(position);
		sprite.scale.set(width, width / 8, 1);
		ActivityRelationships3d.scene.add(sprite);
		ActivityRelationships3d.labels.push(sprite);
	}
}

try {
	ActivityRelationships3d.start();
} catch (error) {
	document.getElementById('status').textContent =
		`The 3D view could not start: ${error.message}. The daily data table remains available below.`;
}
