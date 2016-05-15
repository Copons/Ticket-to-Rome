import chalk from 'chalk';
import {
  SUCCESS,
  ERROR,
} from '../actions';


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
    console.trace(`${chalk.red(ERROR)}: ${msg}`);
    return {
      type: ERROR,
      msg,
      body,
    };
  }

}
