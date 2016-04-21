'use strict';


class Player {


  constructor(player, client) {
    this.client = client;
    this.id = player.id;
    this.name = player.name;
    this.color = '';
    this.cards = 0;
    this.pieces = 0;
    this.points = 0;
    this.destinations = 0;
  }


  simplify() {
    return {
      id: this.id,
      name: this.name,
      color: this.color,
      cards: this.cards,
      pieces: this.pieces,
      points: this.points,
      destinations: this.destinations,
    };
  }

}


module.exports = Player;
