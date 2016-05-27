import { Map, fromJS } from 'immutable';
import {
  SET_GAME,
  START_GAME_SETUP,
  KILL_GAME,
  SET_TURN_ACTIONS,
  REMOVE_GAME_SETUP,
} from '../actions';

const defaultState = new Map();

export default function gameReducer(state = defaultState, action) {
  switch (action.type) {
    case START_GAME_SETUP:
      return new Map(fromJS({
        ...action.game,
        actions: 0,
      }));
    case KILL_GAME:
      return new Map();
    case SET_GAME:
      return state.merge(fromJS(action.game));
    case SET_TURN_ACTIONS:
      return state.set('actions', action.actions);
    case REMOVE_GAME_SETUP:
      return state.delete('setup');
    default:
      return state;
  }
}
