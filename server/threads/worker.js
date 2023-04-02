import { parentPort as main, workerData as thread } from 'worker_threads';

main.postMessage(`Hello from ${thread.id}`);
