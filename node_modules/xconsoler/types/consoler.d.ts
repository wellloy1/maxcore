import type { logLevelsType } from './lib/logLevelsType';
import type { TimeType } from './lib/Time';

interface LoggerOptions {
  active?: 0 | 1 | true | false;
  prefix?: string;
  levels?: logLevelsType;
  time?: TimeType | null | 0 | false;
  colors?: 0 | 1 | true | false;
  timeColor?: 0 | 1 | true | false;
  async?: 0 | 1 | true | false;
}

export default class Consoler {
  constructor(options?: LoggerOptions) {
    this._options = options;
  }

  log(...args: any): void;
  warn(...args: any): void;
  debug(...args: any): void;
  info(...args: any): void;
  fatal(...args: any): void;
  error(...args: any): void;

  assert(...args: any): void;
  clear(...args: any): void;
  count(...args: any): void;
  countReset(...args: any): void;
  dir(...args: any): void;
  dirxml(...args: any): void;
  group(...args: any): void;
  groupCollapsed(...args: any): void;
  groupEnd(...args: any): void;
  table(...args: any): void;
  time(...args: any): void;
  timeEnd(...args: any): void;
  timeLog(...args: any): void;
  trace(...args: any): void;

  Console(...args: any): void;
  timestamp(...args: any): void;
  profile(...args: any): void;
  profileEnd(...args: any): void;
}
