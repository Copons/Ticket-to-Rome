'use strict';
const uuid = require('node-uuid');
const CONFIG = require('../../config');
const Response = require('../communications/Response');


class Deck {


  constructor() {
    this.cards = [];
    this.reset();
  }


  emitCards() {
    return Response.success('Deck.emitCards', this.cards);
  }


  reset() {
    for (const card of CONFIG.DECK) {
      for (let i = 0; i < card.amount; i++) {
        this.cards.push({
          id: uuid.v4(),
          type: card.type,
        });
      }
    }
  }


  draw() {
    if (this.cards.length < 1) {
      return Response.error('Deck is empty.');
    }
    const card = this.cards[Math.floor(Math.random() * this.cards.length)];
    this.cards = this.cards.filter(c => c.id !== card.id);
    return Response.success(`Drawn a [${card.type}] card.`, card);
  }

}


module.exports = Deck;
