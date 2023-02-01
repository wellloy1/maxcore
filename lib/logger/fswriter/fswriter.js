// Simple filesystem logger
// Version: 1.0.0
// Author: Maksim Kotrukhov <wellloy1@gmail.com>
import Time from './time/Time.js';
import fs from 'fs';
import { promises as fsp } from 'fs';
import path from 'path';
import util from 'util';

const LOG_LEVELS = ['error', 'fatal', 'debug', 'info', 'warn', 'log'];

function argSerialize(type, arg) {
	const types = {
		string: () => arg,
		number: () => arg.toString(),
		function: () => arg.toString(),
		boolean: () => arg.toString(),
		bigint: () => arg.toString(),
		symbol: () => arg.toString(),
		object: () => util.formatWithOptions({}, '%O', arg),
		array: () => util.formatWithOptions({}, '%O', arg),
		undefined: () => '<' + arg + '>',
		null: () => '<' + arg + '>',
	};

	return types[type](arg);
}

const wrapStyle = {
	time: (timeString) => timeString,
	log: (logLevel) => '[' + logLevel + ']',
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
	homeDir: (value) => typeof value === 'string',
	keepDays: (value) => typeof value === 'number' && value >= 0 && value <= 365,
	streams: (value) => value.constructor.name === 'Object',
	delimeter: (value) => typeof value === 'string',
};

const DEFAULT_OPTIONS = {
	printTime: true,
	write: true,
	timeString: 'ls',
	logLevels: LOG_LEVELS,
	homeDir: process.cwd(),
	keepDays: 7,
	streams: {},
	delimeter: '',
};

class FSWriter {
	#streams = {};
	#options = Object.assign({}, DEFAULT_OPTIONS);
	#state = { started: false };

	constructor(options) {
		return this.#apply(options).#start();
	}

	#apply(options) {
		Object.assign(this.#options, this.#getValidOptions(options));
		const streams = options.streams;
		for (const streamName in streams) {
			const stream = streams[streamName];
			if (!stream.file) continue;
			if (typeof stream.file !== 'string') continue;
			this.#options.streams[streamName] = this.#getValidOptions(stream);
			this.#options.streams[streamName].file = stream.file;
		}
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
			if (key === 'streams') continue;
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

	async #start(cb) {
		if (this.#state.started === true) return;
		const streams = this.#options.streams;
		for (const streamName in streams) {
			this.#streams[streamName] = {};
			for (const key in streams[streamName]) {
				if (key === 'file') {
					try {
						const homeDir = this.#options.streams[streamName].homeDir ?? this.#options.homeDir;
						const relativePath = this.#options.streams[streamName].file;
						const filePath = path.join(homeDir, relativePath);
						let currentDir = '';
						const dirPath = path.parse(relativePath).dir;
						const dirs = dirPath.split('\\');
						dirs.forEach((dir) => {
							currentDir += dir;
							const absolutePath = path.join(homeDir, currentDir);
							try {
								fs.readdirSync(absolutePath);
							} catch (err) {
								if (err.code === 'ENOENT') {
									fs.mkdirSync(absolutePath, { recursive: true });
								}
							}
						});

						this.#streams[streamName].filePath = filePath;
						this.#streams[streamName].fileHandler = await fsp.open(filePath, 'a+', 0o777);
					} catch (err) {
						console.log(err);
					}
					continue;
				}
				this.#streams[streamName][key] = streams[streamName][key];
			}
		}
		this.#state.started = true;
		if (typeof cb === 'function') {
			cb();
		}
		return this;
	}

	stop(streamName) {
		if (streamName) {
			this.#streams[streamName].write = false;
		} else {
			for (streamName in this.#options.streams) {
				this.#options.write = false;
			}
		}
	}

	async close(streamName) {
		if (streamName) {
			await this.#streams[streamName].close();
			delete this.#streams[streamName];
		} else {
			for (streamName in this.#options.streams) {
				await this.#streams[streamName].close();
				delete this.#streams[streamName];
			}
		}
	}

	#createLogMethod(logLevel, ...args) {
		return (...args) => {
			if (this.#options.write !== true) return;
			if (this.#options.logLevels.includes(logLevel) !== true) return;
			for (const streamName in this.#streams) {
				if (this.#options.streams[streamName].write === false) continue;
				if (this.#options.streams[streamName].logLevels) {
					if (this.#options.streams[streamName].logLevels.includes(logLevel) === false) continue;
				}
				this.#write(logLevel, streamName, ...args);
			}
		};
	}

	#write(logLevel, streamName, ...args) {
		let timeString = null;
		if (this.#options.printTime) {
			timeString = Time[this.#options.streams[streamName].timeString ?? this.#options.timeString]();
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

		fsp.appendFile(
			this.#streams[streamName].fileHandler,
			printline + '\n' + (this.#options.streams[streamName].delimeter ?? this.#options.delimeter),
			'utf8'
		);
	}
}

export { FSWriter, Time };
