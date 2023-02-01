type _serviceName = string;

interface _options {
  start?(): void;
  stop?(): void;
}

declare class ServiceController {
  constructor(serviceName: _serviceName, options: _options);
}

export { ServiceController };
