/* eslint max-classes-per-file: "off" */
class HttpError extends Error {
	constructor(message, statusCode) {
		super(message);
		this.statusCode = statusCode;
	}
}

export class BadRequest extends HttpError {
	constructor(message) {
		super(message, 400);
	}
}

export class Unauthorized extends HttpError {
	constructor(message) {
		super(message, 401);
	}
}

export class PaymentRequired extends HttpError {
	constructor(message) {
		super(message, 402);
	}
}

export class Forbidden extends HttpError {
	constructor(message) {
		super(message, 403);
	}
}

export class NotFound extends HttpError {
	constructor(message) {
		super(message, 404);
	}
}

export class Conflict extends HttpError {
	constructor(message) {
		super(message, 409);
	}
}

export class InternalError extends HttpError {
	constructor(message) {
		super(message, 500);
	}
}

export class NotImplemented extends HttpError {
	constructor(message) {
		super(message, 501);
	}
}

export class Unavailable extends HttpError {
	constructor(message) {
		super(message, 503);
	}
}
