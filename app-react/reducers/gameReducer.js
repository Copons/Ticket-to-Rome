import { Map, fromJS } from 'immutable';
import {
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
    default:
      return state;
  }
}
