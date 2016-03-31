import { RULES } from '../../config';
import PubSub from '../../libs/PubSub';
import Hand from '../hand';

/** Class representing a player. */
export default class Player {


  /**
   * Create the player.
   * @param {string} id    The player's id.
   * @param {string} name  The player's name.
   * @param {string} color The player's color.
   */
  constructor(id, name, color) {
    this.id = id;
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
   * @param {Object} data The Data published when a card is drawn.
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
