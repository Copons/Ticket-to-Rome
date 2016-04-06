'use strict';


class Player {


  constructor(player, client) {
    this.client = client;
    this.id = player.id;
    this.name = player.name;
    this.color = '';
  }


  simplify() {
    return {
      id: this.id,
      name: this.name,
      color: this.color,
    };
  }

}


module.exports = Player;
