'use strict';

class Players {


  constructor(io) {
    this.io = io;
    this.list = [];
  }


  getList() {
    this.io.sockets.emit('players/list', { list: this.list });
  }


  add(data, client) {
    const existingPlayer = this.list.find(player => player.name === data.playerName);
    if (!existingPlayer) {
      this.list.push({
        id: client.id,
        name: data.playerName,
      });
      this.io.sockets.emit('Players/add', {
        type: 'ok',
        message: `Player ${data.playerName} connected.`,
      });
      console.log(`Player ${data.playerName} connected.`);
      this.getList();
    } else if (existingPlayer.id !== client.id) {
      client.emit('Player/add', {
        type: 'error',
        message: `${data.playerName} already exists.`,
      });
      console.log(`${data.playerName} already exists.`);
    }
  }


  remove(client) {
    const playerLeaving = this.list.find(player => player.id === client.id);
    if (playerLeaving) {
      this.list = this.list.filter(player => player.id !== client.id);
      this.io.sockets.emit('Players/remove', {
        type: 'ok',
        message: `Player ${playerLeaving.name} disconnected.`,
      });
      console.log(`Player ${playerLeaving.name} disconnected.`);
      this.getList();
    }
  }


}

module.exports = Players;
