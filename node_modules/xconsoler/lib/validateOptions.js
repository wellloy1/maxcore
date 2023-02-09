import { OPTIONS_VALIDATORS } from './optionsValidators.js';

function validateOptions(options) {
  let message = '';
  let count = 0;
  for (const option in options) {
    if (!Object.prototype.hasOwnProperty.call(OPTIONS_VALIDATORS, option)) {
      count++;
      message += `${count}) '${option}' does not exist\n`;
    } else {
      const args = options[option];
      const result = OPTIONS_VALIDATORS[option](args);
      if (result !== '') {
        count++;
        message += `${count}) ${result}\n`;
      }
    }
  }

  return message;
}

export { validateOptions };
