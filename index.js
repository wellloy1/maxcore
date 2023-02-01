import { loadSystemLogger } from "./system/loadSystemLogger.js";
import { loadSystemHandler } from "./system/loadSystemHandler.js";
import { loadServices } from "./system/loadServices.js";
import { loadEvents } from "./system/loadEvents.js";
import { ServiceController, controller } from "./system/controller.js";

async function start(config = {}) {
  // config = config ?? defaultConfig;
  if (config.logger) loadSystemLogger(config.logger);
  loadSystemHandler();

  console.info("Server is starting", {
    env: process.env.NODE_ENV,
    pid: process.pid,
  });

  await loadServices();
  const events = await loadEvents();
  controller.register(events);
  await controller.startAll();
}

export { start, ServiceController };
