import { List, fromJS } from 'immutable';
import store from '../store';
import { DECK } from '../config/deck';
import { RULES } from '../config/rules';
import Response from './Response';
import Tables from './Tables';
import {
  CREATE_DECK,
  REMOVE_FROM_DECK,
  MULTIPLE_REMOVE_FROM_DECK,
  ADD_TO_PILE,
  REMOVE_FROM_PILE,
} from '../actions';

class Cards {

  // Services

  createDeck = id => new Promise((resolve, reject) => {
    const entry = Tables.oneEntry(id);
    if (!entry) {
      reject(Response.error({ msg: 'Table does not exist.' }));
    } else {
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
      store.dispatch(this.createDeckAction(entry, new List(deck)));
      resolve(Response.success({
        msg: `Deck for game ${id} created.`,
        action: CREATE_DECK,
        payload: id,
      }));
    }
  });

  fillPile = id => new Promise((resolve, reject) => {
    const table = Tables.oneEntry(id);
    if (!table) {
      reject(Response.error({ msg: 'Table does not exist.' }));
    } else {
      const deck = table[1].get('deck').toJS();
      const pile = table[1].get('pile');
      const cards = [];
      for (let i = 0; i < RULES.pile.max - pile.size; i++) {
        const cardIndex = Math.floor(Math.random() * deck.length);
        const card = deck.splice(cardIndex, 1)[0];
        cards.push({
          ...card,
          cardIndex,
        });
      }
      store.dispatch(this.addToPileThunk(table, cards));
      resolve(Response.success({
        msg: `Pile for game ${id} created.`,
        action: ADD_TO_PILE,
      }));
    }
  });




  // Actions

  createDeckAction = (entry, deck) => ({
    type: CREATE_DECK,
    entry,
    deck,
  });

  removeFromDeckAction = (tableIndex, cardIndex) => ({
    type: REMOVE_FROM_DECK,
    tableIndex,
    cardIndex,
  });

  multipleRemoveFromDeckAction = (index, cards) => ({
    type: MULTIPLE_REMOVE_FROM_DECK,
    index,
    cards,
  });

  addToPileAction = (entry, cards) => ({
    type: ADD_TO_PILE,
    entry,
    cards,
  });

  removeFromPileAction = (tableIndex, cardIndex) => ({
    type: REMOVE_FROM_PILE,
    tableIndex,
    cardIndex,
  });




  // Helpers

  addToPileThunk = (table, cards) => dispatch => {
    dispatch(this.multipleRemoveFromDeckAction(table[0], cards));
    dispatch(this.addToPileAction(table, cards));
  };

  multipleRemoveFromDeckReducer = (state, action) =>
    state.setIn(
      [action.index, 'deck'],
      state.get(action.index).get('deck').filter((x, i) =>
        !action.cards.find(c => c.cardIndex === i)
    ));

  addToPileReducer = (state, action) =>
    state.setIn(
      [action.entry[0], 'pile'],
      action.entry[1].get('pile').push(
        ...action.cards.map(c => fromJS({ id: c.id, type: c.type }))
      )
    );
}

export default new Cards();
