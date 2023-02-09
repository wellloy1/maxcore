// Simple terminal logger
// Version: 1.0.0
// Author: Max Shane <wellloy1@gmail.com>
import SonicBoom from 'sonic-boom';
import { LOG_LEVELS } from './lib/logLevels.js';
import { DEFAULT_OPTIONS } from './lib/defaultOptions.js';

import { Time } from './lib/Time.js';
import { formatter } from './lib/formatter.js';
import { formatterColored } from './lib/formatterColored.js';
import { formatterColored2 } from './lib/formatterColored2.js';

import { validateOptions } from './lib/validateOptions.js';

const _print = Symbol();
const _options = Symbol();
const _formatter = Symbol();
const _stream = Symbol();

class Consoler {
  constructor(options = {}) {
    const message = validateOptions(options);
    if (message !== '')
      throw Error(`Cannot instantiate "Consoler": \n\n${message}`);
    this[_options] = Object.assign({}, DEFAULT_OPTIONS);
    Object.assign(this[_options], options);

    // Log levels configuration:
    const activeLevels = this[_options].levels;
    const count = Object.keys(activeLevels).length;

    let atLeastOneTrue = false;

    for (const logLevel in LOG_LEVELS) {
      if (count === 0) {
        activeLevels[logLevel] = false;
      } else if ([1, true].includes(activeLevels[logLevel])) {
        activeLevels[logLevel] = true;
        atLeastOneTrue = true;
      }
    }

    for (const logLevel in LOG_LEVELS) {
      if (count === 0) {
        break;
      } else if ([1, true].includes(activeLevels[logLevel])) {
        activeLevels[logLevel] = LOG_LEVELS[logLevel];
      } else if (activeLevels[logLevel] === undefined) {
        activeLevels[logLevel] = !atLeastOneTrue;
      } else {
        activeLevels[logLevel] = false;
      }
    }

    // Create log methods:
    for (const logLevel in activeLevels) {
      activeLevels[logLevel]
        ? (this[logLevel] = (...args) => {
            this[_print](logLevel, args);
          })
        : (this[logLevel] = function noop() {});
    }

    // Formatter configuration:
    if (this[_options].colors) {
      if (this[_options].timeColor) this[_formatter] = formatterColored;
      else this[_formatter] = formatterColored2;
    } else {
      this[_formatter] = formatter;
    }

    // Stream type configuration:
    if (this[_options].async) {
      this[_stream] = new SonicBoom({ fd: 1 });
    } else {
      this[_stream] = process.stdout;
    }

    // Assign other Node.js console methods
    this.assert = console.assert;
    this.clear = console.clear;
    this.count = console.count;
    this.countReset = console.countReset;
    this.dir = console.dir;
    this.dirxml = console.dirxml;
    this.group = console.group;
    this.groupCollapsed = console.groupCollapsed;
    this.groupEnd = console.groupEnd;
    this.table = console.table;
    this.time = console.time;
    this.timeEnd = console.timeEnd;
    this.timeLog = console.timeLog;
    this.trace = console.trace;
    this.Console = console.Console;
    this.timeStamp = console.timeStamp;
    this.profile = console.profile;
    this.profileEnd = console.profileEnd;
  }

  [_print](logLevel, args) {
    if (!this[_options].active) return;

    let printLine = '';

    if (this[_options].time) {
      const timeString = Time[this[_options].time]();
      printLine += this[_formatter].time(timeString);
      printLine += ' ';
    }

    printLine += this[_formatter].level(logLevel);
    printLine += ' ';

    if (this[_options].prefix) {
      printLine += this[_options].prefix;
      printLine += ' ';
    }

    while (args.length > 0) {
      printLine += this[_formatter].args(args.shift());
      printLine += ' ';
    }

    this[_stream].write(printLine + '\n');
  }
}

export default Consoler;
