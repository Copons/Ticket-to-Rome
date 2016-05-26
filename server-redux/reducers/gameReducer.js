import { List } from 'immutable';
import {
  START_GAME_SETUP,
  KILL_GAME,
  ADD_DESTINATIONS_TO_CHOOSE,
} from '../actions';


const defaultState = new List();

export default function gameReducer(state = defaultState, action) {
  switch (action.type) {

    case START_GAME_SETUP:
      return state.push(action.game);

    case KILL_GAME:
      return state.delete(action.index);

    case ADD_DESTINATIONS_TO_CHOOSE:
      return state.mergeIn([action.index, 'setup', 'destinationsToChoose'], action.destinations);

    default:
      return state;

  }
}
