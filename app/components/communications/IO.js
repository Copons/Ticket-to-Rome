import socket from 'socket.io-client';


class IO {


  constructor() {
    this.io = socket.connect(window.location.host, { reconnect: true });
  }


  connect() {
    return new Promise(resolve => {
      this.io.on('connect', () => {
        resolve(this.io.io.engine.id);
      });
    });
  }


  emit(name, data) {
    return new Promise((resolve, reject) => {
      this.io.emit(name, data, response => {
        if (response.type === 'success') {
          resolve(response);
        } else {
          reject(response);
        }
      });
    });
  }

}


export default new IO();
