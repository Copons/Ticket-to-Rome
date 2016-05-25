import { Map, fromJS } from 'immutable';
import {
  SET_GAME,
  START_GAME,
  KILL_GAME,
  SET_TURN_ACTIONS,
} from '../actions';

const defaultState = new Map();

export default function gameReducer(state = defaultState, action) {
  switch (action.type) {
    case START_GAME:
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
    default:
      return state;
  }
}
