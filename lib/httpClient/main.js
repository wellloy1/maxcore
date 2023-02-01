import { request as undiciRequest } from 'undici';

const types = {
	object: (body) => JSON.stringify(body),
	undefined: (body) => body,
	number: (body) => body.toString(),
	boolean: (body) => body.toString(),
	bigint: (body) => body.toString(),
	function: (body) => body.toString(),
};

const contentTypes = {
	string: 'text/html; charset=utf-8',
	object: 'application/json; charset=utf-8',
};

function serialize(body) {
	const type = typeof body;
	body = types[type](body);
	const contentType = contentTypes[type];
	return { contentType, serializedRequestBody: body };
}

function createRequest(options) {
	return async ({ url = null, path = null, body, headers = {} }) => {
		const { contentType, serializedRequestBody } = serialize(body);
		headers['Content-Type'] = contentType;
		if (url) options.origin = url;
		Object.assign(options, { path, body: serializedRequestBody, headers });
		const response = await undiciRequest(options);
		return { headers: response.headers, body: response.body };
	};
}

export class HttpClient {
	constructor(options) {
        this.options = {}
        if (options?.url) this.options.origin = options.url
        if (options?.bodyTimeout) this.options.bodyTimeout = options.bodyTimeout
        if (options?.headersTimeout) this.options.headersTimeout = options.headersTimeout
        if (options?.throwOnError) this.options.throwOnError = options.throwOnError
		this.get = createRequest(Object.assign({ method: 'GET' }, this.options));
		this.post = createRequest(Object.assign(this.options, { method: 'POST' }));
	}
}
