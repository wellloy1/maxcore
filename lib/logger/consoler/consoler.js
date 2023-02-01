// Simple terminal logger
// Version: 1.0.0
// Author: Maksim Kotrukhov <wellloy1@gmail.com>
import Time from './time/Time.js';
import util from 'util';

const LOG_LEVELS = ['error', 'fatal', 'debug', 'info', 'warn', 'log'];

const ANSI_COLORS = {
	// Dark colors:
	dBlack: [0, 30],
	dRed: [0, 31],
	dGreen: [0, 32],
	dYellow: [0, 33],
	dBlue: [0, 34],
	dMagenta: [0, 35],
	dCyan: [0, 36],
	dWhite: [0, 37],

	// Bright colors:
	black: [1, 30],
	red: [1, 31],
	green: [1, 32],
	yellow: [1, 33],
	blue: [1, 34],
	magenta: [1, 35],
	cyan: [1, 36],
	white: [1, 37],
	default: [1, 39],

	// With background colors:
	bgRed: [1, 41],
	bgGreen: [1, 42],
	bgBlue: [1, 44],
	bgCyan: [1, 46],
};

// Refers to ANSI_COLORS table
const LOG_LEVEL_COLORS = {
	error: 'red',
	fatal: 'red',
	debug: 'cyan',
	trace: 'blue',
	info: 'blue',
	warn: 'yellow',
	log: 'green',
};

const TIMESTRING_COLOR = 'magenta';
const STRING_COLOR = 'dWhite';

function resetColorMode() {
	return '\x1b[0;0m';
}

function applyColorMode(colorCode) {
	return '\x1b[' + colorCode.join(';') + 'm';
}

function argSerialize(type, arg) {
	const types = {
		string: () => {
			const colorCode = ANSI_COLORS[STRING_COLOR];
			return applyColorMode(colorCode) + arg + resetColorMode();
		},
		number: () => util.formatWithOptions({ colors: true }, '%O', arg),
		function: () => arg.toString(),
		boolean: () => util.formatWithOptions({ colors: true }, '%O', arg),
		bigint: () => util.formatWithOptions({ colors: true }, '%O', arg),
		symbol: () => util.formatWithOptions({ colors: true }, '%O', arg),
		object: () => util.formatWithOptions({ colors: true }, '%O', arg),
		array: () => util.formatWithOptions({ colors: true }, '%O', arg),
		undefined: () => util.formatWithOptions({ colors: true }, '%O', arg),
		null: () => util.formatWithOptions({ colors: true }, '%O', arg),
	};
	return types[type](arg);
}

const wrapStyle = {
	time: (timeString) => {
		const colorCode = ANSI_COLORS[TIMESTRING_COLOR];
		return applyColorMode(colorCode) + timeString + resetColorMode();
	},
	log: (logLevel) => {
		const colorCode = ANSI_COLORS[LOG_LEVEL_COLORS[logLevel]];
		return applyColorMode(colorCode) + '[' + logLevel + ']' + resetColorMode();
	},
	serialize: (arg) => {
		let type = undefined;
		if (Array.isArray(arg)) type = 'array';
		else if (arg === null) type = 'null';
		else type = typeof arg;
		return argSerialize(type, arg);
	},
};

const OPTIONS_VALIDATORS = {
	write: (value) => [true, false].includes(value),
	printTime: (value) => [true, false].includes(value),
	timeString: (value) => ['unix', 'ls', 'lds', 'lts', 'iso', 'utc'].includes(value),
	logLevels: (value) => value.constructor.name === 'Array',
};

const DEFAULT_OPTIONS = {
	write: true,
	printTime: true,
	timeString: 'ls',
	logLevels: LOG_LEVELS,
};

class Consoler {
	#options = Object.assign({}, DEFAULT_OPTIONS);

	constructor(options) {
		return this.#apply(options);
	}

	#apply(options) {
		Object.assign(this.#options, this.#getValidOptions(options));
		LOG_LEVELS.forEach((logLevel) => {
			this[logLevel] = this.#createLogMethod(logLevel);
		});
		return this;
	}

	#getValidOptions(options) {
		const validOptions = {};
		for (const key in options) {
			if (!OPTIONS_VALIDATORS[key]) continue;
			const value = options[key];
			if (key === 'logLevels' && OPTIONS_VALIDATORS[key](value)) {
				const optionsLogLevels = [];
				value.forEach((logLevel) => {
					if (!LOG_LEVELS.includes(logLevel)) return;
					optionsLogLevels.push(logLevel);
				});
				if (optionsLogLevels.length > 0) validOptions.logLevels = optionsLogLevels;
				continue;
			}
			if (OPTIONS_VALIDATORS[key](value)) {
				validOptions[key] = value;
			}
		}
		return validOptions;
	}

	#createLogMethod(logLevel, args) {
		return function (...args) {
			this.#print(logLevel, args);
		};
	}

	async #print(logLevel, args) {
		if (!this.#options.write) return;
		if (!this.#options.logLevels.includes(logLevel)) return;

		let timeString = null;
		if (this.#options.printTime) {
			timeString = Time[this.#options.timeString]();
		}

		let printline = '';
		if (timeString !== null) {
			printline += wrapStyle.time(timeString);
			printline += ' ';
		}
		printline += wrapStyle.log(logLevel);

		while (args.length > 0) {
			let arg = args.shift();
			printline += ' ';
			printline += wrapStyle.serialize(arg);
		}

		process.stdout.write(printline + '\n');
	}
}

export { Consoler, Time };
