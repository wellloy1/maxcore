import path from "path";
import fs from "fs";

export async function loadServices(serviceDir) {
  const SERVICES_DIR = serviceDir ?? "./app/services";
  const services = {};
  const servicesDirs = fs.readdirSync(SERVICES_DIR);

  for (const serviceName of servicesDirs) {
    try {
      fs.accessSync(
        path.join(process.cwd(), `${SERVICES_DIR}/${serviceName}/main.js`)
      );
    } catch (err) {
      console.error(
        `Cannot load service "${serviceName}". Service must have "./main.js" file`
      );
      return;
    }

    try {
      const serviceFile = await import(
        path.join(process.cwd(), `${SERVICES_DIR}/${serviceName}/main.js`)
      );
      services[serviceName] = serviceFile.default;
    } catch (err) {
      console.error(`Cannot load service "${serviceName}"\n`, err);
    }
  }
  return services;
}
