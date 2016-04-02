'use strict';
const Deck = require('./Deck');


/** Class representing the games list. */
class Games {


  /**
   * Create the games list.
   * @param {Socket} io The Socket.io server.
   */
  constructor(io) {
    this.io = io;
    this.list = [];
  }


  /**
   * Start a new game in the given room.
   * @param  {Object} room The room in which to start the game.
   * @return {string}
   */
  start(room) {
    const game = {
      room,
      id: room.id,
      deck: new Deck(),
    };
    this.list.push(game);
    this.io.sockets.in(room.id).emit('Game/started', game);
    console.log(`Started game in room [${room.name}].`);
    return 'ok';
  }


  /**
   * Close a game in the given room.
   * @param  {Object} room The room in which to close the game.
   * @return {string}
   */
  close(room) {
    this.list = this.list.filter(g => g.id === room.id);
    return 'ok';
  }


  drawFromDeck(room, client) {
    const response = this.list.find(g => g.room.id === room.id).deck.draw();
    if (response === 'Deck is empty') {
      console.log(response);
    } else {
      client.broadcast.in(room.id).emit('Deck/remove', response);
    }
    return response;
  }

}


module.exports = Games;
