'use strict';


class Player {


  constructor(player, client) {
    this.client = client;
    this.id = player.id;
    this.name = player.name;
  }


  simplify() {
    return {
      id: this.id,
      name: this.name,
    };
  }

}


module.exports = Player;