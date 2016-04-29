import socketIoClient from 'socket.io-client';

export const io = {

  socket: socketIoClient.connect(window.location.host, { reconnect: true }),

  connect: function connect() {
    return new Promise(resolve => {
      this.socket.on('connect', () => {
        resolve(this.socket.io.engine.id);
      });
    });
  },

  emit: function emit(name, data) {
    return new Promise((resolve, reject) => {
      this.socket.emit(name, data, response => {
        if (!response) {
          resolve();
        } else if (response && response.type === 'success') {
          resolve(response);
        } else {
          reject(response);
        }
      });
    });
  },

};
