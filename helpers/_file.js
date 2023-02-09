import fs from 'fs';

function loadFileSync(filePath, data) {
	try {
		return fs.readFileSync(filePath, data);
	} catch (err) {
		console.warn(`Cannot load file`, { filePath });
		throw err;
	}
}

function writeFileSync(filePath, data) {
	try {
		return fs.writeFileSync(filePath, data);
	} catch (err) {
		console.warn(`Cannot write file`, { filePath, err });
		throw err;
	}
}

export { loadFileSync, writeFileSync };
