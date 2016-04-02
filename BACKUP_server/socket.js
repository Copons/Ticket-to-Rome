'use strict';

const socketIo = require('socket.io');
const Players = require('./Players');
const Rooms = require('./Rooms');
const Games = require('./games');

module.exports.listen = server => {
  const io = socketIo.listen(server);
  const players = new Players(io);
  const rooms = new Rooms(io);
  const games = new Games(io);

  io.on('connection', client => {
    // DEBUG
    client.on('Game/debug', room => {
      client.join(room.id);
      games.start(room);
    });

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
      const response = rooms.leave(data.room, data.player, games, client);
      callback(response);
    });
    client.on('Rooms/start', (room, callback) => {
      const response = rooms.start(room, games);
      callback(response);
    });

    // GAMES
    client.on('Deck/draw', (room, callback) => {
      const response = games.drawFromDeck(room, client);
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
