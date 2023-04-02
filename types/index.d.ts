declare interface _console {
	log?();
}

declare interface _services {
	name: string;
	title?: string;
	dir?: string;
	threads?: number;
	logger?: object;
	di?: any;
	disable?: boolean;
	onStart?(): void;
	onStop?(): void;
	onError?(): void;
}

declare interface _options {
	console?: _console;
	services?: _services[];
}

declare async function start(options: _options): Promise<void>;

export { start };
