import uuid from 'node-uuid';
import PubSub from '../../libs/PubSub';
import { RULES } from '../../constants';


/** Class representing a player. */
export default class Player {


  /**
   * Create the player.
   * @param  {string} name - The player's name.
   */
  constructor(name) {
    this.id = uuid.v4();
    this.name = name;
    this.pieces = RULES.startingPieces;
    this.active = false;
    this.hand = {}; // TODO Hand class
    this.builtRoutes = [];

    PubSub.sub('route/claim', this.claimRoute);
  }


  /**
   * Draw a card.
   * @param {string} from The drawn card origin, 'deck' or 'pile'.
   */
  draw(from) {
    // TODO
    console.log(from);
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
