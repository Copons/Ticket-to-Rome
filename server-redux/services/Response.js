import chalk from 'chalk';
import {
  SUCCESS,
  ERROR,
} from '../actions';


export default class Response {

  static success = ({ msg = '', payload = {}, action = '' }) => {
    console.log(`${chalk.green(SUCCESS)}: ${msg}`);
    return {
      type: SUCCESS,
      msg,
      action,
      payload,
    };
  }

  static error = ({ msg = '', payload = {}, action = '' }) => {
    console.trace(`${chalk.red(ERROR)}: ${msg}`);
    return {
      type: ERROR,
      msg,
      action,
      payload,
    };
  }

}
