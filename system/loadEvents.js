import path from "path";
import fs from "fs";

export async function loadEvents(eventsDir) {
  const EVENTS_DIR = eventsDir ?? "./app/events";
  const events = {};
  const serviceEventDirs = fs.readdirSync(EVENTS_DIR);
  for (const serviceDirName of serviceEventDirs) {
    const serviceName = serviceDirName.split(".js")[0];
    const eventFile = await import(
      path.join(process.cwd(), `${EVENTS_DIR}/${serviceName}.js`)
    );
    events[serviceName] = eventFile.default;
  }
  return events;
}
