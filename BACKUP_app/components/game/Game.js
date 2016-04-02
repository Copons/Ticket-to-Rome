import { APP_CONTAINER, RULES, DECK } from '../../config';
import { random } from '../../libs/math';
import PubSub from '../../libs/PubSub';
import Board from '../board';
import Deck from '../deck';
import Player from '../player';


/** Class representing the main game logic. */
export default class Game {


  /**
   * Create the rooms list.
   * @param {Socket} io The Socket.io server.
   */
  constructor(io) {
    this.io = io;
  }


  /**
   * Create the main game logic.
   * @param {Object} game The current game emitted by the server.
   */
  start(game) {
    PubSub.sub('Game/action', this.executeAction);

    this.room = game.room;

    this.turnCount = 1;
    this.turnActionsLeft = RULES.turn.actions;

    this.board = new Board();
    this.deck = new Deck(game.deck, this.io);

    this.players = [];
    this.activePlayer = {};
    this.setupPlayers(game.room.players);
  }


  /**
   * Setup this game players.
   * @param {Array} players The current game players.
   */
  setupPlayers(players) {
    let i = 0;
    for (const player of players) {
      this.activePlayer = new Player(player.id, player.name, DECK[i].type);
      for (let j = 0; j < RULES.player.startingHand; j++) {
        this.deck.draw(this.room);
      }
      this.players.push(this.activePlayer);
      i++;
    }

    const randomIndex = random(players.length);
    this.players[randomIndex].active = true;
    this.activePlayer = this.players[randomIndex];
  }


  /**
   * Execute a game action.
   * @param {Object} data The data published when an action changes.
   */
  executeAction = data => {
    if (data.action === 'Deck/draw') {
      this.actionDrawFromDeck(data);
    } else if (data.action === 'route/claim') {
      this.actionRouteClaimed(data);
    }
  }


  /**
   * Execute the action "draw card from deck".
   * @param {Object} data The data published by the 'deck/draw' action.
   */
  actionDrawFromDeck = data => {
    this.turnActionsLeft - RULES.action.drawFromDeck;
    PubSub.pub('Deck/draw', {
      player: this.activePlayer,
      card: data.card,
    });
    console.log(
      `Player [${this.activePlayer.name} (${this.activePlayer.color})] ` +
      `drawn a [${data.card.type}] card from the deck.`
    );
  }


  /**
   * Execute the action "claim a route".
   * @param {Object} data The data published by the 'route/claim' action.
   */
  actionRouteClaimed = data => {
    this.turnActionsLeft - RULES.action.claimRoute;
    PubSub.pub('route/claim', {
      player: this.activePlayer,
      route: data.route,
      cards: data.cards,
    });

    const sameRoute = this.board.railway.routes.find(route =>
      route !== data.route &&
      route.stations.start.slug === data.route.stations.start.slug &&
      route.stations.end.slug === data.route.stations.end.slug
    );
    if (sameRoute) {
      sameRoute.setUnclaimable();
    }

    console.log(
      `Player [${this.activePlayer.name} (${this.activePlayer.color})] ` +
      `claimed the route [${data.route.stations.start.name} - ${data.route.stations.end.name}] ` +
      `with the cards [${data.cards.join(', ')}].`
    );
  }


  kill() {
    const elementsToRemove = APP_CONTAINER.querySelectorAll('.board, .deck, .hand');
    for (const elem of [...elementsToRemove]) {
      APP_CONTAINER.removeChild(elem);
    }
    this.board = {};
    this.deck = {};
    this.players = [];
    this.activePlayer = {};
  }

}
