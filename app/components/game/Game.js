import { RULES } from '../../config';
import { random } from '../../libs/math';
import PubSub from '../../libs/PubSub';
import Board from '../board';
import Deck from '../deck';
import Player from '../player';


/** Class representing the main game logic. */
export default class Game {


  /**
   * Create the main game logic.
   * @param  {number} numberOfPlayers - The current game's number of players.
   */
  constructor(numberOfPlayers) {
    PubSub.sub('game/action', this.executeAction);

    this.turnCount = 1;
    this.turnActionsLeft = RULES.turn.actions;

    this.board = new Board();
    this.deck = new Deck();

    this.players = [];
    this.activePlayer = {};
    this.setupPlayers(numberOfPlayers);
  }


  /**
   * Setup this game players.
   * @param {number} numberOfPlayers The number of players.
   */
  setupPlayers(numberOfPlayers) {
    for (let i = 0; i < numberOfPlayers; i++) {
      this.activePlayer = new Player(`P${i + 1}`);
      for (let j = 0; j < RULES.player.startingHand; j++) {
        this.deck.draw();
      }
      this.players.push(this.activePlayer);
    }
    const randomIndex = random(numberOfPlayers);
    this.players[randomIndex].active = true;
    this.activePlayer = this.players[randomIndex];
  }


  /**
   * Execute a game action.
   * @param {Object} data The data published when an action changes.
   */
  executeAction = data => {
    if (data.action === 'deck/draw') {
      this.actionDrawFromDeck(data);
    }
  }


  /**
   * Execute the action "draw card from deck".
   * @param {Object} data The data published by the 'deck/draw' action.
   */
  actionDrawFromDeck = data => {
    this.turnActionsLeft - RULES.action.drawFromDeck;
    PubSub.pub('deck/draw', {
      player: this.activePlayer,
      card: data.card,
    });
    console.log(`Player ${this.activePlayer.name} drawn a ${data.card.type} card from deck.`);
  }

}
