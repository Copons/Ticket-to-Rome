import { List, Map } from 'immutable';
import {
  CREATE_TABLE,
  DELETE_TABLE,
  CREATE_DECK,
} from '../actions';
import Tables from '../services/Tables';


const defaultState = new List();

export default function tableReducer(state = defaultState, action) {
  switch (action.type) {
    case CREATE_TABLE:
      return state.push(new Map({ id: action.id }));
    case CREATE_DECK:
      return Tables.createDeckReducer(state, action);
    case DELETE_TABLE:
      return state.filter(t => t.get('id') !== action.id);
    default:
      return state;
  }
}
