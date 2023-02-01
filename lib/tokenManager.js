import crypto from 'crypto';

export class TokenManager {
	constructor(tokenDuration, length) {
		this.tokens = {};
		this.length = length ?? 20;
		this.tokenDuration = tokenDuration;
	}

	create(data) {
		const token = crypto.randomBytes(this.length).toString('hex');
		this.tokens[token] = data;
		// console.log('Token created', { token });
		this.setToDelete(token);
		return token;
	}

	delete(token) {
		if (this.tokens.hasOwnProperty(token)) {
			// console.log('Token deleted', { token });
			delete this.tokens[token];
		}
	}

	setToDelete(token) {
		setTimeout(() => {
			this.delete(token);
		}, this.tokenDuration);
	}

	use(token) {
		const data = this.tokens[token];
		if (data) {
			delete this.tokens[token];
		}
		return data;
	}
}
