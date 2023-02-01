/* Pretty logger
 * Version: 1.0.0
 * Author: Maksim Kotrukhov <wellloy1@gmail.com>
 * Description:
 * class Consoler: logging to terminal
 * class FSWriter: logging to filesystem
 */

import { FSWriter } from './fswriter/fswriter.js';
import { Consoler } from './consoler/consoler.js';

const LOG_LEVELS = ['error', 'fatal', 'debug', 'info', 'warn', 'log'];

export class Logger {
	#consoler = {};
	#fswriter = {};
	constructor({ consoler, fswriter }) {
		return this.start({ consoler, fswriter });
	}
	async start({ consoler, fswriter }) {
		this.#consoler = new Consoler(consoler);
		this.#fswriter = await new FSWriter(fswriter);
		LOG_LEVELS.forEach((logLevel) => {
			this[logLevel] = this.#createLogMethod(logLevel);
		});
		return this;
	}

	#createLogMethod(logLevel, args) {
		return function (...args) {
			this.#write(logLevel, args);
		};
	}

	#write(logLevel, args) {
		this.#consoler[logLevel](...args);
		this.#fswriter[logLevel](...args);
	}
}
