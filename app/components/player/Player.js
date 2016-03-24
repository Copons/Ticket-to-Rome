import uuid from 'node-uuid';
import { RULES } from '../../config';
import PubSub from '../../libs/PubSub';
import Hand from '../hand';

/** Class representing a player. */
export default class Player {


  /**
   * Create the player.
   * @param  {string} name - The player's name.
   */
  constructor(name) {
    this.id = uuid.v4();
    this.name = name;
    this.pieces = RULES.player.startingPieces;
    this.active = false;
    this.hand = new Hand();
    this.builtRoutes = [];

    PubSub.sub('deck/draw', this.draw);
    PubSub.sub('route/claim', this.claimRoute);
  }


  /**
   * Draw a card.
   */
  draw = data => {
    if (data.player.id === this.id) {
      this.hand.addCard(data.card);
    }
  }


  /**
   * Claim and build a route.
   * @param {Object} data The data published when a route is claimed.
   */
  claimRoute = data => {
    // TODO
    console.log(data);
  }

}
