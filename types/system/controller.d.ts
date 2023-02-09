type _serviceName = string;

interface _options {
  start?(): void;
  stop?(): void;
}

declare class Service {
  constructor(serviceName: _serviceName, options: _options);
}

export { Service };
