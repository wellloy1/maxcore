import path from 'path';
import fs from 'fs';

class Controllers {}

export async function loadControllers(config) {
	const appDirName = config.vars.appDirName;
	const controllersDirName = config.vars.controllersDirName;

	if (!appDirName) {
		throw Error(
			`Cannot load any controller. Cannot resolve "appDirName" variable.`
		);
	}

	if (!controllersDirName) {
		throw Error(
			`Cannot load any controller. Cannot resolve "controllersDirName" variable.`
		);
	}

	const controllersDirPath = path.join(appDirName, controllersDirName);

	const controllers = new Controllers();
	const controllersDirsList = fs.readdirSync(controllersDirPath);

	for (const controllerFilename of controllersDirsList) {
		const controllerName = controllerFilename.split('.')[0];
		const cotrollerDirPath = path.join(appDirName, controllersDirName);
		const controllerRelativeFilePath = path.join(
			cotrollerDirPath,
			controllerFilename
		);
		const controllerFilePath = path.join(
			process.cwd(),
			controllerRelativeFilePath
		);

		let controller = null;
		let controllerModule = null;

		try {
			controllerModule = await import(controllerFilePath);
			controller = controllerModule.default;
		} catch (err) {
			throw Error(`Cannot load controller "${controllerName}".\n`, {
				cause: err,
			});
		}

		if (!controllerModule.default) {
			throw Error(
				`Cannot load controller "${controllerName}". Controller must exports as default.`
			);
		}

		controller = controllerModule.default;

		if (typeof controller !== 'function') {
			throw Error(
				`Cannot load controller "${controllerName}". Controller must exports a class or a function returning object (namespace) with methods.`
			);
		}

		// const resolveType =
		// 	controller.toString().indexOf('class') === 0 ? 'asClass' : 'asFunction';

		// try {
		// 	// services.register({
		// 	// 	[serviceName]: awilix[resolveType](service),
		// 	// });
		// } catch (err) {
		// 	throw Error(`Cannot register controller "${controllerName}"\n`, {
		// 		cause: err,
		// 	});
		// }

		controllers[controllerName] = {
			controller,
			path: controllerRelativeFilePath,
		};
	}
	return controllers;
}
