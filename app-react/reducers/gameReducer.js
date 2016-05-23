import { Map, fromJS } from 'immutable';
import {
  SET_GAME,
  START_GAME,
  KILL_GAME,
} from '../actions';

const defaultState = new Map();

export default function gameReducer(state = defaultState, action) {
  switch (action.type) {
    case START_GAME:
      return new Map(fromJS(action.game));
    case KILL_GAME:
      return new Map();
    case SET_GAME:
      return state.merge(fromJS(action.game));
    default:
      return state;
  }
}
