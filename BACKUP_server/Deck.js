'use strict';
const uuid = require('node-uuid');
const CONFIG = require('./config');


class Deck {


  constructor() {
    this.cards = [];
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
    if (this.cards.length < 1) return 'Deck is empty';
    const drawnCard = this.cards[Math.floor(Math.random() * this.cards.length)];
    this.cards = this.cards.filter(card => card.id !== drawnCard.id);
    return drawnCard;
  }

}


module.exports = Deck;
