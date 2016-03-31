'use strict';

const socketIo = require('socket.io');
const Players = require('./Players');
const Rooms = require('./Rooms');

module.exports.listen = server => {
  const io = socketIo.listen(server);
  const players = new Players(io);
  const rooms = new Rooms(io);

  io.on('connection', client => {
    // PLAYERS
    client.on('Players/changeName', (player, callback) => {
      const response = players.add(player);
      callback(response);
    });

    // ROOMS
    client.on('Rooms/list', () => {
      rooms.getList();
    });
    client.on('Rooms/create', (room, callback) => {
      const response = rooms.create(room, client);
      callback(response);
    });
    client.on('Rooms/join', (data, callback) => {
      const response = rooms.join(data.room, data.player, client);
      callback(response);
    });
    client.on('Rooms/leave', (data, callback) => {
      const response = rooms.leave(data.room, data.player, client);
      callback(response);
    });
    client.on('Rooms/start', (room, callback) => {
      const response = rooms.start(room, client);
      callback(response);
    });

    // DISCONNECT
    client.on('disconnect', () => {
      rooms.leaveAll(client);
      players.remove(client);
    });
  });

  return io;
};
