import store from '../store';
import { DECK } from '../config/deck';
import Response from './Response';
import {
  SET_TABLE,
  CREATE_TABLE,
  DELETE_TABLE,
  CREATE_DECK,
} from '../actions';


class Tables {


  // Utilities

  all = () => store.getState().tables;

  one = id => this.all().find(t => t.get('id') === id);


  emitOne = (gameId, io) => {
    const response = Response.success(SET_TABLE, this.one(gameId).toJS());
    io.in(gameId).emit(SET_TABLE, response);
    return response;
  };




  // Services

  dealNewDeck() {
    const deck = [];
    let cardId = 1;
    for (const card of DECK) {
      for (let i = 0; i < card.amount; i++) {
        deck.push({
          id: cardId,
          type: card.type,
        });
        cardId++;
      }
    }
    return deck;
  }




  // Actions

  createTableAction = gameId => ({
    type: CREATE_TABLE,
    id: gameId,
  });

  deleteTableAction = gameId => ({
    type: DELETE_TABLE,
    id: gameId,
  });

  createDeckAction = gameId => ({
    type: CREATE_DECK,
    id: gameId,
  });




  // Helpers

  createThunk = gameId => dispatch => {
    dispatch(this.createTableAction(gameId));
    dispatch(this.createDeckAction(gameId));
  };


  createDeckReducer = (state, action) => {
    const table = state.findEntry(t => t.get('id') === action.id);
    if (!table) return state;
    return state.set(
      table[0],
      table[1].merge({ deck: this.dealNewDeck() })
    );
  }

}

export default new Tables();
