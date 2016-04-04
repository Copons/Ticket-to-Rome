'use strict';


class Room {


  constructor(room) {
    this.id = room.id;
    this.name = room.name;
    this.owner = room.owner;
    this.players = [];
    this.status = 'open';
  }

}


module.exports = Room;
