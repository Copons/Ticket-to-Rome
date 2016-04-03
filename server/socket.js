'use strict';
const socketIo = require('socket.io');
const PlayersList = require('./components/player/PlayersList');


module.exports.listen = server => {
  const io = socketIo.listen(server);
  const playersList = new PlayersList(io);

  io.on('connection', client => {
    console.log(`Client ${client.id} connected.`);


    // PLAYERS
    client.on('Player.setName', (player, callback) => {
      const response = playersList.add(player, client);
      if (response.type === 'success') {
        io.sockets.emit(playersList.getList());
      }
      callback(response);
    });


    // DISCONNECT
    client.on('disconnect', () => {
      playersList.remove(client);
      io.sockets.emit(playersList.getList());
    });
  });

  return io;
};
