import path from 'path';
import fs from 'fs';

class Services {}
class Events {}

export async function loadServices(config) {
	const appDirName = config.vars.appDirName;
	const servicesDirName = config.vars.servicesDirName;
	const serviceFileNames = config.vars.serviceFileNames;
	const eventsFileName = config.vars.eventsFileName;
	const servicesConfig = config.services;

	if (!servicesConfig) {
		return;
	}

	if (!appDirName) {
		throw Error(
			`Cannot load any service. Cannot resolve "appDirName" variable.`
		);
	}

	if (!servicesDirName) {
		throw Error(
			`Cannot load any service. Cannot resolve "servicesDirName" variable.`
		);
	}

	const services = new Services();

	for (const serviceConfig of servicesConfig) {
		const serviceName = serviceConfig.name;
		const serviceDirname = serviceConfig.dir ?? serviceConfig.name;
		const serviceDir = path.join(servicesDirName, serviceDirname);
		let serviceRelativeFilePath = null;
		let serviceFilePath = null;

		try {
			fs.accessSync(
				path.join(process.cwd(), appDirName ?? '', `${servicesDirName}`)
			);
		} catch (err) {
			throw Error(
				`Cannot load services. Services dir "${servicesDirName}" doesn't exists.`
			);
		}

		try {
			fs.accessSync(path.join(process.cwd(), appDirName, `${serviceDir}`));
		} catch (err) {
			throw Error(
				`Cannot load service "${serviceName}". Service dir "${serviceDir}" doesn't exists.`
			);
		}

		let serviceFile = null;

		for (const serviceFileName of serviceFileNames) {
			try {
				fs.accessSync(
					path.join(
						process.cwd(),
						appDirName,
						serviceDir,
						serviceFileName + '.js'
					)
				);
				serviceFile = serviceFileName + '.js';
			} catch (err) {
				continue;
			}
		}

		if (!serviceFile) {
			throw Error(
				`Cannot load service "${serviceName}". Service must have "{${serviceFileNames.join(
					'/'
				)}}.js" file`
			);
		}

		serviceRelativeFilePath = path.join(appDirName, serviceDir, serviceFile);
		serviceFilePath = path.join(process.cwd(), serviceRelativeFilePath);

		let service = null;
		let serviceModule = null;

		try {
			serviceModule = await import(serviceFilePath);
		} catch (err) {
			throw Error(`Cannot load service "${serviceName}".\n`, { cause: err });
		}

		if (!serviceModule.default) {
			throw Error(
				`Cannot load controller "${serviceName}". Controller must exports as default.`
			);
		}

		service = serviceModule.default;

		if (typeof service !== 'function') {
			throw Error(
				`Cannot load service "${serviceName}". Service must exports a class or a function returning object (namespace) with methods.`
			);
		}

		// Load service events:
		const events = new Events();
		const eventsRelativeFilePath = path.join(
			appDirName,
			serviceDir,
			eventsFileName + '.js'
		);
		const eventsFilePath = path.join(process.cwd(), eventsRelativeFilePath);

		let eventsModule = null;
		let hasEvents = false;

		try {
			fs.accessSync(eventsFilePath);
			hasEvents = true;
		} catch (err) {
			//
		}

		if (hasEvents) {
			try {
				eventsModule = await import(eventsFilePath);
			} catch (err) {
				throw Error(`Cannot load events file for service "${serviceName}".\n`, {
					cause: err,
				});
			}

			if (!eventsModule.default) {
				throw Error(
					`Cannot load events file for "${serviceName}". Events must exports as default.`
				);
			}

			if (
				typeof eventsModule.default !== 'object' ||
				eventsModule.default === null
			) {
				throw Error(
					`Cannot load events file for "${serviceName}". Events file must exports an object (namespace).`
				);
			}
			Object.assign(events, eventsModule.default);
		}

		services[serviceName] = {
			service,
			events,
			title: serviceConfig.title ?? serviceName,
			path: serviceRelativeFilePath,
			threads: serviceConfig.threads ?? null,
			logger: serviceConfig.logger ?? null,
			di: serviceConfig.di,
		};

		// const resolveType =
		// 	service.toString().indexOf('class') === 0 ? 'asClass' : 'asFunction';

		// try {
		// 	await registerService(service);
		// } catch (err) {
		// 	throw Error(`Cannot register service "${serviceName}".\n`, {
		// 		cause: err,
		// 	});
		// }

		// try {
		// 	const resolveType =
		// 		typeof service !== 'function'
		// 			? 'asValue'
		// 			: service.prototype.constructor.toString().indexOf('class') === 0
		// 			? 'asClass'
		// 			: 'asFunction';

		// 	console.log(resolveType);
		// 	services.register({
		// 		[serviceName]: awilix[resolveType](service),
		// 	});
		// } catch (err) {
		// 	throw Error(`Cannot register service "${serviceName}"\n`, { cause: err });
		// }
	} // for of servicesConfig

	return services;
}
