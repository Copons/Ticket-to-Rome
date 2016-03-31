'use strict';

class Players {


  constructor(io) {
    this.io = io;
    this.list = [];
  }


  getList() {
    this.io.sockets.emit('Players/list', { rooms: this.list });
  }


  add(player) {
    this.remove(player);
    const existingPlayer = this.list.find(p => p.name === player.name);
    if (!existingPlayer) {
      this.list.push(player);
      this.getList();
      console.log(`Player [${player.name}] connected.`);
      return 'ok';
    } else if (existingPlayer.id !== player.id) {
      console.log(`Player [${player.name}] already exists.`);
      return `Player <b>${player.name}</b> already exists.`;
    } else {
      console.log('Something went wrong!');
      return 'Something went wrong!';
    }
  }


  remove(client) {
    const player = this.list.find(p => client.id.includes(p.id));
    if (player) {
      this.list = this.list.filter(p => !client.id.includes(p.id));
      this.getList();
      console.log(`Player [${player.name}] disconnected.`);
      return `Player <b>${player.name}</b> disconnected.`;
    }
  }

}

module.exports = Players;
