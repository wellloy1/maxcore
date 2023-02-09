import path from "path";
import fs from "fs";

export async function loadTasks(tasksDir) {
  const TASKS_DIR = tasksDir ?? "./app/tasks";
  const tasks = {};
  const taskFilesNames = fs.readdirSync(TASKS_DIR);

  for (const taskFileName of taskFilesNames) {
    const taskName = taskFileName.split(".js")[0];
    const taskFile = await import(
      path.join(process.cwd(), `${TASKS_DIR}/${taskFileName}`)
    );
    tasks[taskName] = taskFile.default;
  }

  return tasks;
}
