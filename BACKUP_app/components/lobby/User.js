import { sessionSet, sessionGet } from '../../libs/storage';
import Message from '../message';
import PubSub from '../../libs/PubSub';


/** Class representing a user. */
export default class User {


  /**
   * Create the user.
   * @param {Socket} io The Socket.io client.
   */
  constructor(io) {
    this.io = io;
    this.id = io.io.engine.id;
    this.name = '';

    PubSub.sub('User/name', this.updateName);
  }


  /**
   * Helper function to update a user property.
   * @param {string} key   The user property.
   * @param {string} value The new value.
   */
  update = (key, value) => {
    this[key] = value;
    if (key === 'name') {
      sessionSet('ttr_username', value);
    }
    PubSub.pub('User/changed', {
      id: this.id,
      name: this.name,
    });
  }


  /**
   * Try to obtain the username from the session storage.
   */
  setupName() {
    const name = sessionGet('ttr_username');
    if (name) {
      this.updateName(name, false);
    } else {
      this.updateName('', false);
    }
  }


  /**
   * Update the username.
   * @param {string}  name           The new username.
   * @param {boolean} [message=true] Prevent the Message popup.
   */
  updateName = (name, message = true) => {
    if (name === '') return;
    const user = {
      name,
      id: this.id,
    };
    this.io.emit('Players/changeName', user, response => {
      if (response === 'ok') {
        this.update('name', name);
        if (message) {
          Message.show({
            type: 'success',
            message: 'Username changed!',
          });
        }
      } else {
        this.update('name', '');
        Message.show({
          type: 'error',
          message: response,
        });
      }
    });
  }

}
