function loadSystemLogger(logger) {
  // Stupidly replace original 'console' methods
  if (!logger.assert) logger.assert = console.assert;
  if (!logger.clear) logger.clear = console.clear;
  if (!logger.count) logger.count = console.count;
  if (!logger.countReset) logger.countReset = console.countReset;
  if (!logger.dir) logger.dir = console.dir;
  if (!logger.dirxml) logger.dirxml = console.dirxml;
  if (!logger.group) logger.group = console.group;
  if (!logger.groupCollapsed) logger.groupCollapsed = console.groupCollapsed;
  if (!logger.groupEnd) logger.groupEnd = console.groupEnd;
  if (!logger.table) logger.table = console.table;
  if (!logger.time) logger.time = console.time;
  if (!logger.timeEnd) logger.timeEnd = console.timeEnd;
  if (!logger.timeLog) logger.timeLog = console.timeLog;
  if (!logger.trace) logger.trace = console.trace;
  console = logger;
  Object.freeze(console);
}

export { loadSystemLogger };
