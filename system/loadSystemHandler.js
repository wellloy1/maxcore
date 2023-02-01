// Handle uncaughtExceptions, unhandledRejections, warnings, exits and custom system errors
import process from 'process';

// Configuration:
const EXIT_CODES = {
	0: 'EXECUTION_COMPLETED',
	1: 'uncaughtException',
	129: 'SIGHUP',
	130: 'SIGINT',
	134: 'SIGABRT',
	143: 'SIGTERM',
};

function loadSystemHandler() {
	process.on('uncaughtExceptionMonitor', (err) => {
		try {
			console.fatal(err);
			setTimeout(() => {
				process.exit(1);
			}, 200);
		} catch (err) {
			process.exit(1);
		}
	});

	process.on('warning', (msg) => {
		console.warn('warning', { msg });
	});

	process.on('beforeExit', () => {
		try {
			console.info('Server has been stopped', { signal: EXIT_CODES[0], code: 0 });
			setTimeout(() => {
				process.exit(0);
			}, 1);
		} catch (err) {
			process.exit(1);
		}
	});
}

export { loadSystemHandler };
