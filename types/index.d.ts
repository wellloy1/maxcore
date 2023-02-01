import { ServiceController, controller } from "./system/controller";

declare interface _logger {
  log?: any;
}

declare interface _options {
  logger?: _logger;
}

declare async function start(options: _options): Promise<void>;

export { start, ServiceController };
