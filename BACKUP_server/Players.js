'use strict';


/** Class representing the players list stored in the server memory. */
class Players {


  /**
   * Create the players list.
   * @param {Socket} io The Socket.io server.
   */
  constructor(io) {
    this.io = io;
    this.list = [];
  }


  /**
   * Emit the players list to the client.
   */
  getList() {
    this.io.sockets.emit('Players/list', { rooms: this.list });
  }


  /**
   * Add a new player to the list, if possible.
   * @param  {Object} player The new player information.
   * @return {string}
   */
  add(player) {
    this.remove(player);
    const existingPlayer = this.list.find(p => p.name === player.name);
    if (!existingPlayer) {
      this.list.push(player);
      this.getList();
      console.log(`Player [${player.name}] connected.`);
      return 'ok';
    } else if (existingPlayer.id !== player.id) {
      console.log(`Player [${player.name}] already exists.`);
      return `Player <b>${player.name}</b> already exists.`;
    } else {
      console.log('Something went wrong!');
      return 'Something went wrong!';
    }
  }


  /**
   * Remove a player from the list.
   * @param {Socket} client The Socket.io client to remove.
   */
  remove(client) {
    const player = this.list.find(p => client.id.includes(p.id));
    if (player) {
      this.list = this.list.filter(p => !client.id.includes(p.id));
      this.getList();
      console.log(`Player [${player.name}] disconnected.`);
      return `Player <b>${player.name}</b> disconnected.`;
    }
  }

}


module.exports = Players;
