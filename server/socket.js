'use strict';

const socketIo = require('socket.io');
const Players = require('./Players');
const Rooms = require('./Rooms');

module.exports.listen = server => {
  const io = socketIo.listen(server);
  const players = new Players(io);
  const rooms = new Rooms(io, players);

  io.on('connection', client => {
    // PLAYERS
    client.on('Players/add', data => {
      players.add(data, client);
    });

    // ROOMS
    client.on('Rooms/list', () => {
      rooms.getList(client);
    });
    client.on('Rooms/create', data => {
      rooms.create(data, client);
    });
    client.on('Rooms/join', data => {
      rooms.join(data, client);
    });
    client.on('Rooms/leave', data => {
      rooms.leave(data, client);
    });

    // DISCONNECT
    client.on('disconnect', () => {
      players.remove(client);
      // leave all rooms
    });
  });

  return io;
};
