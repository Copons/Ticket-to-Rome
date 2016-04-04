'use strict';
//const CONFIG = require('../../config');
const Response = require('../communications/Response');
const Game = require('./Game');


class Games {


  constructor() {
    this.list = [];
  }


  getList() {
    return this.list;
  }


  start(room) {
    if (this.list.find(g => g.id === room.id)) {
      return Response.error(`A game in room [${room.name}] is already running.`);
    }

    const game = new Game(room);
    this.list.push(game);
    return Response.success(`Starting game in room [${game.room.name}].`, game);
  }


  close(room) {
    this.list = this.list.filter(g => g.id === room.id);
    return Response.success(`Game in room [${room.name}] ended.`);
  }


  closeOnLeaving(client) {
    for (const game of this.list) {
      const player = game.room.players.find(p => client.id.includes(p.id));
      if (player) {
        this.close(game.room);
        return Response.error(
          `Game in room [${game.room.name}] ended because [${player.name}] left.`,
          game
        );
      }
    }
    return false;
  }

}


module.exports = Games;
