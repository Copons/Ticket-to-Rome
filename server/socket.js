'use strict';

// http://www.tamas.io/advanced-chat-using-node-js-and-socket-io-episode-1/



const socketIo = require('socket.io');
const Rooms = require('./Rooms');
//import Room from './Room';

module.exports.listen = server => {
  const io = socketIo.listen(server);
  const rooms = new Rooms(io);

  io.on('connection', client => {
    client.on('room/list', () => {
      rooms.getList(client);
    });
    client.on('room/create', data => {
      rooms.create(data, client);
    });
    client.on('room/join', data => {
      rooms.join(data, client);
    });
    client.on('room/leave', data => {
      rooms.leave(data, client);
    });
  });

  return io;
};
