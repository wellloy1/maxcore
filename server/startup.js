import { load } from './loader/index.js';
import config from './config.js';
import './threads/main.js';
// import serviceController from './system/serviceController.js';

process.env.DIR_APP = './app';
process.env.DIR_SERVICES = './services';
process.env.DIR_CONTROLLERS = './controllers';

export async function start(_config = {}) {
	Object.assign(config, _config);
	const { services, controllers } = await load(config);

	console.log({ services, controllers });
	// serviceController.register(services);
	// controller.register(events);
	// await controller.startAll();
	// return services;
}
