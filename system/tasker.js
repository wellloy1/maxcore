import { loadTasks } from "./loadTasks.js";

const tasks = await loadTasks();

const taskList = Object.keys(tasks);
const runned = {};

const tasker = {
  get tasks() {
    return taskList;
  },
};

taskList.forEach((taskName) => {
  tasker.run = {};
  tasker.run[taskName] = async (params) => {
    try {
      console.log(`Task "${taskName}" has been executed`);
      const result = await tasks[taskName](params);
      return result;
    } catch (err) {
      console.error(err);
    }
  };

  tasker.runOnce = {};
  tasker.runOnce[taskName] = async (params) => {
    if (runned[taskName]) {
      console.warn(`Task "${taskName}" cannot be runned once again`);
      return;
    }
    try {
      console.log(`Task "${taskName}" has been executed`);
      const result = await tasks[taskName](params);
      runned[taskName] = true;
      delete tasks[taskName];
      return result;
    } catch (err) {
      console.error(err);
    }
  };
});

export { tasker };
