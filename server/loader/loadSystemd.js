import { SystemController } from '../controller.js';
import { Systemd } from '../systemd.js';

import { loadEvents } from './loadEvents.js';

export async function loadSystemd() {
	const system = new SystemController();
	const events = await loadEvents();
	system.registerServiceEvents(events);
	await system.startAll();
	// await Systemd.runOnce('hello'); //
}
