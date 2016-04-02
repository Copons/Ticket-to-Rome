'use strict';
const Response = require('../communications/Response');
const Player = require('./Player');


class PlayersList {


  constructor() {
    this.list = [];
  }


  emitList(recipients) {
    const list = this.list.map(p => p.simplify());
    recipients.emit('PlayersList.emitList', { players: list });
  }


  add(player, client) {
    this.remove(client);
    const existingPlayer = this.list.find(p => p.name === player.name);
    if (!existingPlayer) {
      this.list.push(new Player(player, client));
      return Response.success(`Player [${player.name}] connected.`);
    } else if (existingPlayer.id !== player.id) {
      return Response.error(`Player [${player.name}] already exists.`);
    } else {
      return Response.error('Something went wrong!');
    }
  }


  remove(client) {
    const player = this.list.find(p => client.id.includes(p.id));
    if (player) {
      this.list = this.list.filter(p => !client.id.includes(p.id));
      return Response.success(`Player [${player.name}] disconnected.`);
    }
  }

}


module.exports = PlayersList;
