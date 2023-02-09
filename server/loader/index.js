import { loadSystemLogger } from './loadSystemLogger.js';
import { loadSystemHandler } from './loadSystemHandler.js';
import { loadEnv } from './loadEnv.js';
import { loadServices } from './loadServices.js';
import { loadEvents } from './loadEvents.js';
import { loadControllers } from './loadControllers.js';

export async function load(config = {}) {
	if (config.console) loadSystemLogger(config.console);

	loadSystemHandler();
	loadEnv();

	console.info('Starting server', {
		env: process.env.NODE_ENV,
		pid: process.pid,
	});

	const services = await loadServices(config);
	const controllers = await loadControllers(config);

	return {
		services,
		controllers,
	};
}
