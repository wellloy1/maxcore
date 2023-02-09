import fs from 'fs';

export function readJSON(filePath) {
	const file = fs.readFileSync(filePath, 'utf8');
	return JSON.parse(file);
}
