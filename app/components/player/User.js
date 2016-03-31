import { sessionSet, sessionGet } from '../../libs/storage';
import Message from '../message';
import PubSub from '../../libs/PubSub';


export default class User {


  constructor(io) {
    this.io = io;
    this.id = io.io.engine.id;
    this.name = '';

    PubSub.sub('User/name', this.updateName);
  }


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


  setupName() {
    const name = sessionGet('ttr_username');
    if (name) {
      this.updateName(name, false);
    } else {
      this.updateName('', false);
    }
  }


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
