import Consoler from 'xconsoler';

export default {
	vars: {
		appDirName: 'app',
		servicesDirName: 'services',
		controllersDirName: 'controllers',
		serviceFileNames: ['main', 'index', 'service'],
		modelFileNames: ['main', 'index', 'model'],
		eventsFileName: 'events',
	},
	console: new Consoler(),
};
