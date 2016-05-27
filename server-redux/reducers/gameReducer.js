import { List } from 'immutable';
import {
  START_GAME_SETUP,
  KILL_GAME,
  ADD_DESTINATIONS_TO_CHOOSE,
  REMOVE_GAME_SETUP,
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

    case REMOVE_GAME_SETUP:
      return state.deleteIn([action.entry[0], 'setup']);

    default:
      return state;

  }
}
