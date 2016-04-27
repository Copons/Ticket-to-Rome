'use strict';
const chalk = require('chalk');
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
    this.lastPlayer = null;
    this.deck = new Deck();
    this.destinations = new DestinationDeck();
    this.pile = [];
    this.discardPile = [];
    this.dealPile();
  }


  drawFromDeck(player) {
    const response = this.deck.draw();

    if (response.type === 'success') {
      this.room.players.find(p => p.id === player.id).cards++;

      if (this.deck.cards.length < 1) {
        console
          .log(`${chalk.magenta('drawFromDeck BEFORE SHUFFLE')}: ${this.discardPile.length}`);
        this.deck.shuffle(this.discardPile);
        this.discardPile = [];
        console
          .log(`${chalk.magenta('drawFromDeck AFTER SHUFFLE')}: ${this.discardPile.length}`);
      }
    }

    return response;
  }


  drawFromPile(cardId, player) {
    const cardIndex = this.pile.findIndex(c => c.id === cardId);
    const card = this.pile.splice(cardIndex, 1);
    this.room.players.find(p => p.id === player.id).cards++;
    return Response.success(
      `Player [${player.name}] drew a [${card[0].type}] card from the pile.`,
      card[0]
    );
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


  dealPile() {
    const missingCards = CONFIG.RULES.pile.max - this.pile.length;

    if (this.deck.cards.length < missingCards) {
      console
        .log(`${chalk.magenta('dealPile BEFORE DECK NEEDS CARDS')}: ${this.discardPile.length}`);
      this.deck.shuffle(this.discardPile);
      this.discardPile = [];
      console
        .log(`${chalk.magenta('dealPile AFTER DECK NEEDS CARDS')}: ${this.discardPile.length}`);
    }

    for (let i = 0; i < missingCards; i++) {
      const response = this.deck.draw();
      if (response.type === 'success') {
        this.pile.push(response.body);
      } else {
        return response;
      }
    }

    let countWild = 0;
    for (const card of this.pile) {
      if (card.type === 'wild') {
        countWild++;
      }
    }
    if (countWild > CONFIG.RULES.pile.maxWild) {
      console
        .log(`${chalk.magenta('dealPile BEFORE DISCARD 4+ WILD')}: ${this.discardPile.length}`);
      this.discardPile = this.discardPile.concat(this.pile);
      this.pile = [];
      console
        .log(`${chalk.magenta('dealPile AFTER DISCARD 4+ WILD')}: ${this.discardPile.length}`);
      this.dealPile();
    }

    if (this.deck.cards.length < 1) {
      console
        .log(`${chalk.magenta('dealPile BEFORE DECK EMPTY')}: ${this.discardPile.length}`);
      this.deck.shuffle(this.discardPile);
      this.discardPile = [];
      console
        .log(`${chalk.magenta('dealPile AFTER DECK EMPTY')}: ${this.discardPile.length}`);
    }

    return Response.success('Pile is ready.', { pile: this.pile });
  }


  changeTurn(player) {
    if (this.lastPlayer && player.id === this.lastPlayer.id) {
      return Response.success('GAME OVER! Let\'s count the points!', {
        player: {},
        turn: 'endgame',
      });
    }

    const playerIndex = this.room.players.findIndex(p => p.id === player.id);

    let nextPlayerIndex = 0;
    if (playerIndex < this.room.players.length - 1) {
      nextPlayerIndex = playerIndex + 1;
    } else {
      this.turn++;
    }
    this.activePlayer = this.room.players[nextPlayerIndex];

    if (this.lastPlayer || this.activePlayer.pieces <= CONFIG.RULES.player.endGamePieces) {
      if (!this.lastPlayer) {
        this.lastPlayer = this.activePlayer;
      }
      return Response.success(`It's now player [${this.activePlayer.name}]'s last turn!`, {
        player: this.activePlayer,
        last: this.lastPlayer,
        turn: 'last',
      });
    } else {
      return Response.success(`It's now player [${this.activePlayer.name}]'s turn!`, {
        player: this.activePlayer,
        last: this.lastPlayer,
        turn: this.turn,
      });
    }
  }


  claimRoute(data) {
    const player = this.room.players.find(p => p.id === data.game.activePlayer.id);

    if (player.cards < data.cards.length) {
      return Response.error(`Player [${player.name}] doesn't have enough cards to claim the route [${data.route.start.name} - ${data.route.end.name}].`); // eslint-disable-line max-len
    }
    if (player.pieces < data.cards.length) {
      return Response.error(`Player [${player.name}] doesn't have enough pieces to claim the route [${data.route.start.name} - ${data.route.end.name}].`); // eslint-disable-line max-len
    }

    player.cards -= data.cards.length;
    player.pieces -= data.cards.length;
    player.points += CONFIG.RULES.points[data.cards.length];

    this.discardPile = this.discardPile.concat(data.cards);
    console.log(`${chalk.magenta('claimRoute AFTER CLAIM')}: ${this.discardPile.length}`);

    return Response.success(`Player [${player.name}] claimed the route [${data.route.start.name} - ${data.route.end.name}] and earned [${CONFIG.RULES.points[data.cards.length]}] points.`); // eslint-disable-line max-len
  }

}


module.exports = Game;
