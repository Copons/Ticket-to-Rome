'use strict';
const CONFIG = require('../../config');
const Deck = require('../deck/Deck');
const Response = require('../communications/Response');


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


  dealFirstHand(player) {
    const cards = [];
    for (let i = 0; i < CONFIG.RULES.player.startingHand; i++) {
      const response = this.deck.draw();
      if (response.type === 'success') {
        cards.push(response.body);
        this.room.players.find(p => p.id === player.id).cards++;
      }
    }
    return Response.success('First hand was dealt successfully.', { cards });
  }


  changeTurn(player) {
    const playerIndex = this.room.players.findIndex(p => p.id === player.id);
    let nextPlayerIndex = 0;
    if (playerIndex < this.room.players.length - 1) {
      nextPlayerIndex = playerIndex + 1;
    }
    this.activePlayer = this.room.players[nextPlayerIndex];
    return Response.success(
      `It's now player [${this.activePlayer.name}]'s turn!`,
      this.activePlayer
    );
  }

}


module.exports = Game;
