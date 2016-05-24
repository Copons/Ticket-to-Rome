import { List } from 'immutable';
import store from '../store';
import { DECK } from '../config/deck';
import { RULES } from '../config/rules';
import Hands from './Hands';
import Players from './Players';
import Response from './Response';
import Tables from './Tables';
import {
  CREATE_DECK,
  DRAW_FROM_DECK,
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

  drawFromDeck = (playerId, gameId) => new Promise((resolve, reject) => {
    const hand = Hands.oneEntry(playerId);
    const table = Tables.oneEntry(gameId);
    if (!table) {
      reject(Response.error({ msg: 'Table does not exist.' }));
    } else if (!hand) {
      reject(Response.error({ msg: 'Player does not exist.' }));
    } else {
      const player = Players.one(playerId);
      const deck = table[1].get('deck');
      const cardIndex = Math.floor(Math.random() * deck.size);
      const card = deck.get(cardIndex);
      store.dispatch(this.drawFromDeckAction(table, cardIndex, hand, card));
      resolve(Response.success({
        msg: `Player ${player.get('name')} drew a card from the deck.`,
        action: DRAW_FROM_DECK,
        payload: card,
      }));
    }
  });




  // Actions

  createDeckAction = (entry, deck) => ({
    type: CREATE_DECK,
    entry,
    deck,
  });

  drawFromDeckAction = (table, cardIndex, hand, card) => ({
    type: DRAW_FROM_DECK,
    table,
    cardIndex,
    hand,
    card,
  });

}

export default new Cards();
