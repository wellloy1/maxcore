import { Worker } from 'worker_threads';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const workerPath = path.join(__dirname, './worker.js');

const w = new Worker(workerPath, { workerData: { id: '1' } });

w.on('message', (message) => {
	console.log(message);
});

export {};
