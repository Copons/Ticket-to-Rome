import { sessionSet, sessionGet } from '../../libs/storage';
import Message from '../message';
import PubSub from '../../libs/PubSub';


export default class User {


  constructor(io) {
    this.io = io;
    this.id = io.io.engine.id;
    this.name = '';
    this.room = false;

    PubSub.sub('User/name', this.updateName);
    PubSub.sub('Room/join', this.joinRoom);
    PubSub.sub('Room/leave', this.leaveRoom);
  }


  update = (key, value) => {
    this[key] = value;
    if (key === 'name') {
      sessionSet('ttr_username', value);
    }
    PubSub.pub('User/changed', {
      id: this.id,
      name: this.name,
      room: this.room,
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
      room: this.room,
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


  joinRoom = room => {
    this.update('room', room.id);
  }


  leaveRoom = () => {
    this.update('room', false);
  }

}
