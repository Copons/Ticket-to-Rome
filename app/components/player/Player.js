import uuid from 'node-uuid';
import { RULES } from '../../config';
import PubSub from '../../libs/PubSub';
import Hand from '../hand';

/** Class representing a player. */
export default class Player {


  /**
   * Create the player.
   * @param {string} name The player's name.
   * @param {string} color The player's color.
   */
  constructor(name, color) {
    this.id = uuid.v4();
    this.name = name;
    this.color = color;
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
      PubSub.pub('hand/changed', {
        player: this.id,
        hand: this.hand.groups,
      });
    }
  }


  /**
   * Claim and build a route.
   * @param {Object} data The data published when a route is claimed.
   */
  claimRoute = data => {
    for (const card of data.cards) {
      this.hand.groups.find(group => group.type === card).removeCard();
    }
    this.builtRoutes.push({
      start: data.route.stations.start.slug,
      end: data.route.stations.end.slug,
    });
    data.route.setClaimed(this);
    PubSub.pub('hand/changed', {
      player: this.id,
      hand: this.hand.groups,
    });
  }

}
