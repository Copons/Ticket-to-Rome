'use strict';
const CONFIG = require('../../config');
const Deck = require('../deck/Deck');


class Game {


  constructor(room) {
    this.id = room.id;
    this.room = room;
    this.turn = 0;
    this.room.players.forEach((player, index) => {
      this.room.players[index].color = CONFIG.RULES.player.colorsOrder[index];
    });
    this.activePlayer = this.room.players[
      Math.floor(Math.random() * this.room.players.length)
    ];
    this.deck = new Deck();
  }

}


module.exports = Game;
