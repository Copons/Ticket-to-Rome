'use strict';
const CONFIG = require('../../config');
const Deck = require('../deck/Deck');
const DestinationDeck = require('../deck/DestinationDeck');
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
    this.destinations = new DestinationDeck();
  }


  drawFromDeck(player) {
    const response = this.deck.draw();
    if (response.type === 'success') {
      this.room.players.find(p => p.id === player.id).cards++;
    }
    return response;
  }


  drawDestination(player) {
    const response = this.destinations.draw();
    if (response.type === 'success') {
      this.room.players.find(p => p.id === player.id).destinations++;
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


  dealFirstDestinations(player) {
    const destinations = [];
    for (let i = 0; i < CONFIG.RULES.player.startingDestinations; i++) {
      const response = this.destinations.draw();
      if (response.type === 'success') {
        destinations.push(response.body);
        this.room.players.find(p => p.id === player.id).destinations++;
      }
    }
    return Response.success('First destinations were dealt successfully.', { destinations });
  }


  changeTurn(player) {
    const playerIndex = this.room.players.findIndex(p => p.id === player.id);
    let nextPlayerIndex = 0;
    if (playerIndex < this.room.players.length - 1) {
      nextPlayerIndex = playerIndex + 1;
    } else {
      this.turn++;
    }
    this.activePlayer = this.room.players[nextPlayerIndex];
    return Response.success(
      `It's now player [${this.activePlayer.name}]'s turn!`,
      this.activePlayer
    );
  }


  claimRoute(data) {
    const player = this.room.players.find(p => p.id === data.game.activePlayer.id);

    if (player.cards < data.cards) {
      return Response.error(`Player [${player.name}] doesn't have enough cards to claim the route [${data.route.start.name} - ${data.route.end.name}].`); // eslint-disable-line max-len
    }
    if (player.pieces < data.cards) {
      return Response.error(`Player [${player.name}] doesn't have enough pieces to claim the route [${data.route.start.name} - ${data.route.end.name}].`); // eslint-disable-line max-len
    }

    player.cards -= data.cards;
    player.pieces -= data.cards;
    player.points += CONFIG.RULES.points[data.cards];
    return Response.success(`Player [${player.name}] claimed the route [${data.route.start.name} - ${data.route.end.name}] and earned [${CONFIG.RULES.points[data.cards]}] points.`); // eslint-disable-line max-len
  }

}


module.exports = Game;
