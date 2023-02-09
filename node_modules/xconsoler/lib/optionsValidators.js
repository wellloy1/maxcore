import { LOG_LEVELS } from './logLevels.js';
import { Time } from './Time.js';

export const OPTIONS_VALIDATORS = {
  prefix: (value) => {
    const valueType = typeof value;
    const isTrue = valueType === 'string' || valueType === 'number';
    if (isTrue) return '';
    return `'prefix' option must be a type of: string | number | null`;
  },

  active: (value) => {
    const isTrue = [true, false, 0, 1].includes(value);
    if (isTrue) return '';
    return `'active' option must be a type of: 'true | false | 0 | 1'`;
  },

  time: (value) => {
    const isTrue =
      Object.keys(Time).includes(value) || [null, 0, false].includes(value);
    if (isTrue) return '';
    return `'timeFormat' option must be a type of: "unix" | "iso" | "utc" | "ls" | "lts" | "lds"`;
  },

  timeColor: (value) => {
    const isTrue = [true, false, 0, 1].includes(value);
    if (isTrue) return '';
    return `'timeColor' option must be a type of: 'true | false | 0 | 1'`;
  },

  levels: (value) => {
    let isTrue = true;

    if (typeof value === 'object') {
      for (const level in value) {
        if (!Object.prototype.hasOwnProperty.call(LOG_LEVELS, level)) {
          isTrue = false;
        }
        if (![true, false, 0, 1].includes(value[level])) {
          isTrue = false;
        }
      }
    } else {
      isTrue = false;
    }
    if (isTrue) return '';
    return `'levels' option must be a type of: { [logLevel]: true | false | 0 | 1, ... }`;
  },

  colors: (value) => {
    const isTrue = [true, false, 0, 1].includes(value);
    if (isTrue) return '';
    return `'color' option must be a type of: 'true | false | 0 | 1'`;
  },

  async: (value) => {
    const isTrue = [true, false, 0, 1].includes(value);
    if (isTrue) return '';
    return `'async' option must be a type of: 'true | false | 0 | 1'`;
  },
};
