import qs from 'qs';
import { generateKeyPairSync, createSign, createVerify } from 'crypto';

const rsaPublic = { type: 'pkcs1', format: 'der' };
const rsaPrivate = { type: 'pkcs8', format: 'der' };
const dsaPublic = { type: 'spki', format: 'der' };
const dsaPrivate = { type: 'pkcs8', format: 'der' };
const algorithmsOptions = {
	dsa: { publicKeyEncoding: dsaPublic, privateKeyEncoding: dsaPrivate },
	rsa: { publicKeyEncoding: rsaPublic, privateKeyEncoding: rsaPrivate },
};

export class CryptoSign {
	constructor({ algorithm = 'rsa', outputFormat = 'base64' } = {}) {
		this.algorithm = algorithm;
		this.outputFormat = outputFormat;
	}

	generateKeys({ passphrase } = {}) {
		const options = algorithmsOptions[this.algorithm];
		if (passphrase) {
			options.privateKeyEncoding.cipher = 'aes-256-cbc';
			options.privateKeyEncoding.passphrase = passphrase;
		}

		const { publicKey, privateKey } = generateKeyPairSync(this.algorithm, {
			modulusLength: 512,
			...options,
		});
		return {
			publicKey: publicKey.toString(this.outputFormat),
			privateKey: privateKey.toString(this.outputFormat),
		};
	}

	sign(privateKey, data, passphrase) {
		const signer = createSign('sha256');
		signer.update(typeof data === 'object' ? CryptoRmg.stringify(data) : data);
		return signer.sign(
			{
				key: this.strToBuffer(privateKey),
				...algorithmsOptions[this.algorithm].privateKeyEncoding,
				passphrase,
			},
			this.outputFormat
		);
	}

	verify(publicKey, signature, data) {
		const verifier = createVerify('sha256');
		verifier.update(typeof data === 'object' ? CryptoRmg.stringify(data) : data);
		return verifier.verify(
			{ key: this.strToBuffer(publicKey), ...algorithmsOptions[this.algorithm].publicKeyEncoding },
			signature,
			this.outputFormat
		);
	}

	strToBuffer(str) {
		return Buffer.from(str, this.outputFormat);
	}

	static stringify(data) {
		const asc = (a, b) => (a > b ? 1 : -1);
		return qs.stringify(data, { sort: asc });
	}
}
