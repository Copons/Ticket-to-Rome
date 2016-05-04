import chalk from 'chalk';
import { SUCCESS, ERROR } from '../actions/actionTypes';

export default class Response {

  static success = (msg = '', body = {}) => {
    console.log(`${chalk.green(SUCCESS)}: ${msg}`);
    return {
      type: SUCCESS,
      msg,
      body,
    };
  }

  static error = (msg = '', body = {}) => {
    console.log(`${chalk.red(ERROR)}: ${msg}`);
    return {
      type: ERROR,
      msg,
      body,
    };
  }

}
