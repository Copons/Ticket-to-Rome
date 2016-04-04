'use strict';
const socketIo = require('socket.io');
const PlayersList = require('./components/player/PlayersList');
const RoomsList = require('./components/room/RoomsList');


module.exports.listen = server => {
  const io = socketIo.listen(server);
  const playersList = new PlayersList(io);
  const roomsList = new RoomsList(io);

  io.on('connection', client => {
    console.log(`Client ${client.id} connected.`);


    // PLAYERS
    client.on('Player.setName', (player, callback) => {
      const response = playersList.add(player, client);
      callback(response);
    });


    // ROOMS
    client.on('Lobby.getRoomsList', () => {
      io.sockets.emit('Rooms.getList', roomsList.emitList());
    });
    client.on('Lobby.createRoom', (room, callback) => {
      const response = roomsList.create(room, client);
      io.sockets.emit('Rooms.getList', roomsList.emitList());
      callback(response);
    });
    client.on('Lobby.joinRoom', (data, callback) => {
      const response = roomsList.join(data.room, data.player, client);
      io.sockets.emit('Rooms.getList', roomsList.emitList());
      callback(response);
    });
    client.on('Lobby.leaveRoom', (data, callback) => {
      const response = roomsList.leave(data.room, data.player, client);
      io.sockets.emit('Rooms.getList', roomsList.emitList());
      callback(response);
    });


    // GAMES
    client.on('Lobby.startGame', (room, callback) => {
      const response = roomsList.startGame(room);
      if (response.type === 'success') {
        io.in(room.id).emit('Game.start', response);
        // TODO ACTUALLY START GAME!
      }
      callback(response);
    });


    // DISCONNECT
    client.on('disconnect', () => {
      roomsList.leaveAll(client);
      io.sockets.emit('Rooms.getList', roomsList.emitList());

      playersList.remove(client);
    });
  });

  return io;
};
