import Player from './Player';
import {
  SET_HAND,
  ADD_CARD,
  ADD_DESTINATION,
  MULTIPLE_ADD_DESTINATION,
} from '../actions';

class Hand {

  // Utilities

  findPlayerHand = hands => hands.find(h => h.player === Player.getId());




  // Actions

  setHandAction = hand => ({
    type: SET_HAND,
    hand,
  });

  addCardAction = card => ({
    type: ADD_CARD,
    card,
  });

  addDestinationAction = destination => ({
    type: ADD_DESTINATION,
    destination,
  });

  multipleAddDestinationAction = destinations => ({
    type: MULTIPLE_ADD_DESTINATION,
    destinations,
  });

}

export default new Hand();
