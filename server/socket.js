'use strict';
const socketIo = require('socket.io');
const PlayersList = require('./components/player/PlayersList');


module.exports.listen = server => {
  const io = socketIo.listen(server);
  const playersList = new PlayersList(io);

  io.on('connection', client => {
    console.log(`Client ${client.id} connected.`);

    // PLAYERS
    client.on('Player.changeName', (player, callback) => {
      const response = playersList.add(player, client);
      if (response.type === 'success') {
        playersList.emitList(io.sockets);
      }
      callback(response);
    });
  });

  return io;
};
