'use strict';
const CONFIG = require('../../config');
const Deck = require('../deck/Deck');


class Game {


  constructor(room) {
    this.id = room.id;
    this.room = room;
    this.turn = 0;
    let i = 0;
    for (const player of this.room.players) {
      player.color = CONFIG.RULES.player.colorsOrder[i];
      player.cards = 0;
      player.pieces = CONFIG.RULES.player.startingPieces;
      i++;
    }
    this.activePlayer = this.room.players[
      Math.floor(Math.random() * this.room.players.length)
    ];
    this.deck = new Deck();
  }


  drawFromDeck(player) {
    const response = this.deck.draw();
    if (response.type === 'success') {
      this.room.players.find(p => p.id === player.id).cards++;
    }
    return response;
  }

}


module.exports = Game;
