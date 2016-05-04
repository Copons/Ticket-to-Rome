import socketIoClient from 'socket.io-client';
import store from '../store';
import { CONNECT, SUCCESS } from '../actions/actionTypes';
import { setPlayer } from '../actions';

class IO {

  constructor() {
    this.socket = socketIoClient.connect(window.location.host, { reconnect: true });
  }

  connect = () =>
    new Promise(resolve => {
      this.socket.on(CONNECT, () => {
        store.dispatch(setPlayer({ client: this.socket.io.engine.id }));
        resolve(this.socket.io.engine.id);
      });
    })


  emit = (action, data) =>
    new Promise((resolve, reject) => {
      this.socket.emit(action, data, response => {
        if (!response) {
          resolve();
        } else if (response && response.type === SUCCESS) {
          resolve(response);
        } else {
          reject(response);
        }
      });
    })

  on = (action, callback) => {
    this.socket.on(action, callback);
  }

}

export default new IO();
