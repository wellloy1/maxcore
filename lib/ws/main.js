import { WebSocketServer } from 'ws';

export default class WS {
	#server = null;
	constructor({ port }, handlers, serviceName) {
		this.port = port;
		this.#server = new WebSocketServer({
			port,
			perMessageDeflate: {
				zlibDeflateOptions: {
					chunkSize: 1024,
					memLevel: 7,
					level: 3,
				},
				zlibInflateOptions: {
					chunkSize: 10 * 1024,
				},
				clientNoContextTakeover: true,
				serverNoContextTakeover: true,
				serverMaxWindowBits: 10,
				concurrencyLimit: 10,
				threshold: 1024,
			},
		});
		this.#server.on(
			'disconnect',
			handlers.disconnect ??
				function () {
					console.info(`Client has been disconnected from ${serviceName} service`, { port });
				}
		);
		this.#server.on(
			'listening',
			handlers.listening ??
				function () {
					console.info(`${serviceName} service has been started`, { port, type: 'ws' });
				}
		);
		this.#server.on(
			'close',
			handlers.close ??
				function () {
					console.info(`${serviceName} service has been stopped`, { port });
				}
		);

		this.#server.on('connection', (ws, req, client) => {
			handlers.connection(ws, req, client) ??
				function () {
					console.info(`New client has been connected to ${serviceName} service`, { port });
				};
			ws.on('message', (message) => handlers.message(ws, message.toString()) ?? function (message) {});
		});

		this.#server.on(
			'error',
			handlers.error ??
				function (err) {
					console.error(`An error occured in the ${serviceName} service`, {
						port: this.port,
						code: err.code,
					});
				}
		);
	}

	async stop() {
		this.#server.close();
	}
	async clients() {
		return this.#server.clients;
	}
}
