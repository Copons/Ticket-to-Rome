'use strict';
//const CONFIG = require('../../config');
const Response = require('../communications/Response');
const Game = require('./Game');


class Games {


  constructor() {
    this.list = [];
  }


  game(id) {
    return this.list.find(g => g.id === id);
  }


  info(id) {
    const game = this.game(id);
    return {
      active: game.activePlayer,
      deck: game.deck.length,
      players: game.room.players,
      turn: game.turn,
    };
  }


  start(room) {
    if (this.game(room.id)) {
      return Response.error(`A game in room [${room.name}] is already running.`);
    }

    const game = new Game(room);
    this.list.push(game);
    return Response.success(`Starting game in room [${game.room.name}].`, game);
  }


  close(room) {
    this.list = this.list.filter(g => g.id === room.id);
    return Response.success(`Game in room [${room.name}] ended.`);
  }


  closeOnLeaving(client, io) {
    let response = {};

    for (const game of this.list) {
      const player = game.room.players.find(p => client.id.includes(p.id));
      if (player) {
        this.close(game.room);
        response = Response.error(
          `Game in room [${game.room.name}] ended because [${player.name}] left.`,
          game
        );
      }
    }

    if (response.body) {
      io.in(response.body.id).emit('Game.closed', response);
    }
  }


  dealFirstHand(data, io) {
    const game = this.game(data.game.id);
    const response = game.dealFirstHand(data.player);

    io.in(game.id).emit('Deck.count', game.deck.cards.length);
    io.in(game.id).emit('Game.updated', this.info(game.id));
    return response;
  }


  dealFirstDestinations(data, io) {
    const game = this.game(data.game.id);
    const response = game.dealFirstDestinations(data.player);

    io.in(game.id).emit('DestinationDeck.count', game.destinations.cards.length);
    io.in(game.id).emit('Game.updated', this.info(game.id));
    return response;
  }


  dealPile(data, io) {
    const game = this.game(data.game.id);
    const response = game.dealPile();

    if (response.type === 'success') {
      io.in(game.id).emit('Deck.count', game.deck.cards.length);
      io.in(game.id).emit('Pile.updated', response);
    }
    return response;
  }


  changeTurn(data, io) {
    const game = this.game(data.game.id);
    const response = game.changeTurn(data.player);

    io.in(game.id).emit('Game.turnChanged', response);
    io.in(game.id).emit('Game.updated', this.info(game.id));
    return response;
  }


  drawFromDeck(data, client, io) {
    const game = this.game(data.id);
    const response = game.drawFromDeck(game.activePlayer);

    if (response.type === 'success') {
      client.broadcast.in(game.id).emit('Message.Deck.draw',
        `Player [${game.activePlayer.name}] drew a card.`
      );
      client.broadcast.in(game.id).emit('Deck.count', game.deck.cards.length);
    }

    io.in(game.id).emit('Game.updated', this.info(game.id));
    return response;
  }


  drawFromPile(data, client, io) {
    const game = this.game(data.game.id);
    const response = game.drawFromPile(data.card.id, data.game.activePlayer);

    if (response.type === 'success') {
      client.broadcast.in(game.id).emit('Message.Pile.draw', response.message);
      this.dealPile(data, io);
    }

    io.in(data.game.id).emit('Game.updated', this.info(data.game.id));
    return response;
  }


  drawDestination(data, client, io) {
    const game = this.game(data.id);
    const response = game.drawDestination(game.activePlayer);

    if (response.type === 'success') {
      client.broadcast.in(game.id).emit('Message.DestinationDeck.draw',
        `Player [${game.activePlayer.name}] drew a destination.`
      );
      client.broadcast.in(game.id).emit('DestinationDeck.count', game.destinations.cards.length);
    }

    io.in(game.id).emit('Game.updated', this.info(game.id));
    return response;
  }


  claimRoute(data, client, io) {
    const game = this.game(data.game.id);
    const response = game.claimRoute(data);

    if (response.type === 'success') {
      client.broadcast.in(game.id).emit('Message.Route.claim', response.message);
      io.in(game.id).emit('Route.claimed', {
        route: data.route,
        player: game.activePlayer,
      });
    }

    io.in(game.id).emit('Game.updated', this.info(game.id));
    return response;
  }

}


module.exports = new Games();
