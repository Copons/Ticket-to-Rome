'use strict';
const uuid = require('node-uuid');
const CONFIG = require('../../config');
const Response = require('../communications/Response');


class DestinationDeck {


  constructor() {
    this.cards = [];
    this.reset();
  }


  reset() {
    for (const destination of CONFIG.DESTINATIONS) {
      this.cards.push({
        id: uuid.v4(),
        start: destination.start,
        end: destination.end,
        points: destination.points,
      });
    }
  }


  draw() {
    if (this.cards.length < 1) {
      return Response.error('There are no destinations left.');
    }
    const destination = this.cards[Math.floor(Math.random() * this.cards.length)];
    this.cards = this.cards.filter(d => d.id !== destination.id);
    return Response.success('Drawn a new destination.', destination);
  }

}


module.exports = DestinationDeck;
