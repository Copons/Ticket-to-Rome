import PubSub from '../../libs/PubSub';
import { random } from '../../libs/math';
import { RULES } from '../../constants';
import Deck from '../deck';
import Player from '../player';


/** Class representing the main game logic. */
export default class Game {


  /**
   * Create the main game logic.
   * @param  {number} numberOfPlayers - The current game's number of players.
   */
  constructor(numberOfPlayers) {
    this.turnCount = 1;
    this.turnActionsLeft = RULES.turnActions;

    this.deck = new Deck();

    this.setupPlayers(numberOfPlayers);

    PubSub.sub('game/action', this.executeAction);
  }


  /**
   * Setup this game players.
   * @param {number} numberOfPlayers The number of players.
   */
  setupPlayers(numberOfPlayers) {
    this.players = [];
    for (let i = 0; i < numberOfPlayers; i++) {
      this.players.push(new Player(`P${i + 1}`));
    }
    const randomIndex = random(numberOfPlayers);
    this.players[randomIndex].active = true;
    this.activePlayer = this.players[randomIndex];
    PubSub.pub('game/players', this.players);
    PubSub.pub('game/activePlayer', this.activePlayer);
  }


  /**
   * Execute a game action.
   * @param {Object} data The data published when an action changes.
   */
  executeAction = data => {
    if (data.action === 'deck/draw') {
      this.turnActionsLeft - RULES.actionsDrawFromDeck;
      console.log(`${this.activePlayer.name} drawn a ${data.card.type} card from deck.`);
    }
  }

}
