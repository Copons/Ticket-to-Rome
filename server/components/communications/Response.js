'use strict';
const chalk = require('chalk');


class Response {


  static success(message, value) {
    console.log(`${chalk.green('SUCCESS')}: ${message}`);
    return {
      message,
      type: 'success',
      body: value || {},
    };
  }


  static error(message, value) {
    console.log(`${chalk.red('ERROR')}: ${message}`);
    return {
      message,
      type: 'error',
      body: value || {},
    };
  }

}


module.exports = Response;
