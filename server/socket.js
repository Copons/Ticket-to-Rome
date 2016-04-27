'use strict';
const socketIo = require('socket.io');
const Players = require('./components/players/Players');
const Rooms = require('./components/rooms/Rooms');
const Games = require('./components/games/Games');


module.exports.listen = server => {
  const io = socketIo.listen(server);

  io.on('connection', client => {
    console.log(`Client ${client.id} connected.`);


    // PLAYERS

    client.on('Player.setName', (player, callback) => {
      callback(Players.add(player, client));
    });


    // ROOMS

    client.on('Lobby.getRoomsList', () => {
      io.sockets.emit('Rooms.getList', Rooms.emitList());
    });

    client.on('Lobby.createRoom', (room, callback) => {
      callback(Rooms.create(room, client, io));
    });

    client.on('Lobby.joinRoom', (data, callback) => {
      callback(Rooms.join(data, client, io));
    });

    client.on('Lobby.leaveRoom', (data, callback) => {
      callback(Rooms.leave(data, client, io));
    });


    // GAMES

    client.on('Lobby.startGame', (room, callback) => {
      callback(Rooms.startGame(room, io));
    });

    client.on('Player.initHand', (data, callback) => {
      callback(Games.dealFirstHand(data, io));
    });

    client.on('Player.initDestinations', (data, callback) => {
      callback(Games.dealFirstDestinations(data, io));
    });

    client.on('Pile.deal', (data, callback) => {
      callback(Games.dealPile(data, io));
    });

    client.on('Player.endTurn', (data, callback) => {
      callback(Games.changeTurn(data, io));
    });

    client.on('Deck.draw', (game, callback) => {
      callback(Games.drawFromDeck(game, client, io));
    });

    client.on('Pile.draw', (game, callback) => {
      callback(Games.drawFromPile(game, client, io));
    });

    client.on('DestinationDeck.draw', (game, callback) => {
      callback(Games.drawDestination(game, client, io));
    });

    client.on('Route.claim', (data, callback) => {
      callback(Games.claimRoute(data, client, io));
    });

    client.on('Endgame.close', (data, callback) => {
      Games.closeOnLeaving(client, io);
      Rooms.leaveAll(client, io);
      callback({
        message: 'Game over!',
        type: 'success',
        body: {},
      });
    });


    // DISCONNECT

    client.on('disconnect', () => {
      Games.closeOnLeaving(client, io);
      Rooms.leaveAll(client, io);
      Players.remove(client);
    });
  });

  return io;
};
