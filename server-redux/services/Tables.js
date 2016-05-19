import { Map, fromJS } from 'immutable';
import store from '../store';
import { DECK } from '../config/deck';
import Games from './Games';
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

  one = id => this.all().find(t => t.get('game') === id);

  oneEntry = id => this.all().findEntry(t => t.get('game') === id);

  emit = (id, io) => {
    const table = this.one(id);
    const res = Response.success({
      msg: SET_TABLE,
      action: SET_TABLE,
      payload: table,
    });
    io.in(id).emit(SET_TABLE, res);
    return res;
  };




  // Services

  create = id => new Promise((resolve, reject) => {
    const game = Games.one(id);
    if (!game) {
      reject(Response.error({ msg: 'Game does not exist.' }));
    } else {
      const table = new Map(fromJS({
        game: id,
        deck: [],
        pile: [],
        discards: [],
        destinations: [],
      }));
      store.dispatch(this.createAction(table));
      resolve(Response.success({
        msg: `Table for game ${id} created.`,
        action: CREATE_TABLE,
        payload: id,
      }));
    }
  });

  createDeck = id => new Promise((resolve, reject) => {
    const entry = this.oneEntry(id);
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
      store.dispatch(this.createDeckAction(entry, deck));
      resolve(Response.success({
        msg: `Deck for game ${id} created.`,
        action: CREATE_DECK,
        payload: id,
      }));
    }
  });

  delete = id => new Promise((resolve, reject) => {
    const entry = this.oneEntry(id);
    if (!entry) {
      reject();
    } else {
      store.dispatch(this.deleteAction(entry[0]));
      resolve(Response.success({
        msg: `Table ${entry[1].get('id')} deleted.`,
        action: DELETE_TABLE,
        payload: entry[1],
      }));
    }
  });




  // Actions

  createAction = table => ({
    type: CREATE_TABLE,
    table,
  });

  deleteAction = index => ({
    type: DELETE_TABLE,
    index,
  });

  createDeckAction = (entry, deck) => ({
    type: CREATE_DECK,
    entry,
    deck,
  });

}

export default new Tables();
