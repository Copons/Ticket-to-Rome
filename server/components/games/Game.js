'use strict';


class Game {


  constructor(room) {
    this.id = room.id;
    this.room = room;
    this.turn = 0;
    this.activePlayer = this.room.players[
      Math.floor(Math.random() * this.room.players.length)
    ];
  }

}


module.exports = Game;
