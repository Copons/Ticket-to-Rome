'use strict';
const socketIo = require('socket.io');
const Players = require('./components/players/Players');
const Rooms = require('./components/rooms/Rooms');
const Games = require('./components/games/Games');


module.exports.listen = server => {
  const io = socketIo.listen(server);
  const players = new Players();
  const rooms = new Rooms();
  const games = new Games();

  io.on('connection', client => {
    console.log(`Client ${client.id} connected.`);


    // PLAYERS

    client.on('Player.setName', (player, callback) => {
      const response = players.add(player, client);
      callback(response);
    });


    // ROOMS

    client.on('Lobby.getRoomsList', () => {
      io.sockets.emit('Rooms.getList', rooms.emitList());
    });

    client.on('Lobby.createRoom', (room, callback) => {
      const response = rooms.create(room, client);
      io.sockets.emit('Rooms.getList', rooms.emitList());
      callback(response);
    });

    client.on('Lobby.joinRoom', (data, callback) => {
      const response = rooms.join(data.room, data.player, client);
      if (response.type === 'success') {
        client.broadcast.in(data.room.id).emit('Message.Player.joinRoom', response.message);
      }
      io.sockets.emit('Rooms.getList', rooms.emitList());
      callback(response);
    });

    client.on('Lobby.leaveRoom', (data, callback) => {
      const response = rooms.leave(data.room, data.player, client);
      io.sockets.emit('Rooms.getList', rooms.emitList());
      if (response.type === 'success') {
        io.in(data.room.id).emit('Message.Player.leaveRoom', response.message);
      }
      const gameClosed = games.closeOnLeaving(client);
      if (gameClosed.body) {
        io.in(gameClosed.body.id).emit('Game.closed', gameClosed);
      }
      callback(response);
    });


    // GAMES

    client.on('Lobby.startGame', (room, callback) => {
      const response = rooms.startGame(room, games);
      if (response.type === 'success') {
        io.in(room.id).emit('Game.start', response);
      }
      callback(response);
    });

    client.on('Deck.draw', (game, callback) => {
      const response = games.game(game.id).deck.draw();
      if (response.type === 'success') {
        client.broadcast.in(game.id).emit('Message.Deck.draw',
          `Player [${game.activePlayer.name}] drew a card.`
        );
        client.broadcast.in(game.id).emit(
          'Deck.count',
          games.game(game.id).deck.cards.length
        );
      }
      callback(response);
    });


    // DISCONNECT

    client.on('disconnect', () => {
      const gameClosed = games.closeOnLeaving(client);
      if (gameClosed.body) {
        io.in(gameClosed.body.id).emit('Game.closed', gameClosed);
      }

      rooms.leaveAll(client);
      io.sockets.emit('Rooms.getList', rooms.emitList());

      players.remove(client);
    });
  });

  return io;
};
