import Player from './Player';
import {
  SET_HAND,
} from '../actions';

class Hand {

  // Utilities

  findPlayerHand = hands => hands.find(h => h.player === Player.getId());




  // Actions

  setHandAction = hand => ({
    type: SET_HAND,
    hand,
  });

}

export default new Hand();
