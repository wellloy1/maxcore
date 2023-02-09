import { randomUUID } from 'crypto';

export default {
	_events: {},
	_systemEvents: {},

	register(events) {
		this._events = events;
	},

	_registerService(options) {
		const serviceName = options.serviceName;
		this._systemEvents[serviceName] = {
			start: options.start,
			stop: options.stop,
		};
	},

	async _call(serviceName, event, ctx) {
		try {
			const result = await this._events[serviceName][event](ctx);
			return result;
		} catch (err) {
			const eventId = randomUUID();
			console.error({
				eventId,
				serviceName,
				event,
				ctx,
				reason: err.message,
				stack: err.stack,
			});
			err.message = err.message + `; eventId: ${eventId}`;
			throw err;
		}
	},

	get events() {
		return this._events;
	},

	get systemEvents() {
		return this._systemEvents;
	},

	async start(serviceName) {
		const service = this._systemEvents[serviceName];
		try {
			const data = await service.start();
			console.info(`Service "${serviceName}" has been started`, data ?? '');
		} catch (err) {
			console.error(`Failed to start "${serviceName}" service`, { err });
		}
	},

	async startAll() {
		for (const serviceName in this._systemEvents) {
			await this.start(serviceName);
		}
	},
};

function registerService(serviceName, options = {}) {
	const start = options?.start ?? (async () => {});
	const stop = options?.stop ?? (async () => {});

	if (!serviceName)
		throw new Error(
			`Cannot create service without valid "serviceName" parameter`
		);
	if (serviceName === 'System') {
		throw new Error(`Cannot create service with reserved system name "System"`);
	}

	const service = {
		call(event, data) {
			return controller._call(serviceName, event, data);
		},
		emit(event, data) {
			return controller._call(serviceName, event, data);
		},
	};

	if (options.logger) service.logger = options.logger;

	controller._registerService({ serviceName, start, stop });

	return registerService;
}
