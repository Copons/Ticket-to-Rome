'use strict';

class Players {


  constructor(io) {
    this.io = io;
    this.list = [];
  }


  getList() {
    this.io.sockets.emit('Players/list', { list: this.list });
  }


  add(data, client) {
    this.remove(client);
    const existingPlayer = this.list.find(player => player.name === data.name);
    if (!existingPlayer) {
      const player = {
        id: client.id,
        name: data.name,
      };
      this.list.push(player);
      client.emit('Players/add/details', player);
      this.io.sockets.emit('Players/add', `Player [${player.name}] connected.`);
      console.log(`Player [${player.name}] connected.`);
      this.getList();
    } else if (existingPlayer.id !== client.id) {
      client.emit('Players/add/error', `Player [${data.name}] already exists.`);
      console.log(`Player [${data.name}] already exists.`);
    }
  }


  remove(client) {
    const playerLeaving = this.list.find(player => player.id === client.id);
    if (playerLeaving) {
      this.list = this.list.filter(player => player.id !== client.id);
      this.io.sockets.emit('Players/remove', `Player [${playerLeaving.name}] disconnected.`);
      console.log(`Player [${playerLeaving.name}] disconnected.`);
      this.getList();
    }
  }


}

module.exports = Players;
