import { Map, fromJS } from 'immutable';
import store from '../store';
import { RULES } from '../config/rules';
import Cards from './Cards';
import Players from './Players';
import Response from './Response';
import Tables from './Tables';
import {
  CREATE_HAND,
  DELETE_HAND,
  RESET_HAND,
  ALL_HANDS_IN_GAME,
  DRAW_FROM_DECK,
  MULTIPLE_DRAW_FROM_DECK,
  DRAW_FROM_PILE,
  DRAW_DESTINATION,
  PICK_DESTINATIONS,
} from '../actions';


class Hands {


  // Utilities

  all = () => store.getState().hands;

  one = id => this.all().find(h => h.get('player') === id);

  oneEntry = id => this.all().findEntry(h => h.get('player') === id);

  resetHand = () => ({
    cards: [],
    destinations: [],
  });

  emitAllInGame = (gameId, idList, io) => {
    const hands = [];
    idList.forEach(id => {
      hands.push(this.one(id));
    });
    const res = Response.success({
      msg: ALL_HANDS_IN_GAME,
      action: ALL_HANDS_IN_GAME,
      payload: hands,
    });
    io.in(gameId).emit(ALL_HANDS_IN_GAME, res);
    return res;
  }




  // Services

  create = id => new Promise((resolve, reject) => {
    const player = Players.one(id);
    if (!player) {
      reject(Response.error({ msg: 'Player does not exist.' }));
    } else {
      const hand = new Map(fromJS({
        player: id,
        ...this.resetHand(),
      }));
      store.dispatch(this.createAction(hand));
      resolve(Response.success({
        msg: `Player ${player.get('name')} hand created.`,
        action: CREATE_HAND,
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
        msg: `Hand ${entry[1].get('player')} deleted.`,
        action: DELETE_HAND,
        payload: entry[1],
      }));
    }
  });

  reset = id => new Promise((resolve, reject) => {
    const entry = this.oneEntry(id);
    if (!entry) {
      reject(Response.error({ msg: 'Hand does not exist.' }));
    } else {
      store.dispatch(this.resetHandAction(entry));
      resolve(Response.success({
        msg: `Hand ${id} reset.`,
        action: RESET_HAND,
        payload: { ...this.resetHand() },
      }));
    }
  });

  resetAllInGame = idList => new Promise(resolve => {
    idList.forEach(id => {
      store.dispatch(this.resetHandAction(this.oneEntry(id)));
    });
    resolve(Response.success({
      msg: 'Hands reset.',
      action: RESET_HAND,
    }));
  });

  drawFromDeck = (playerId, gameId) => new Promise((resolve, reject) => {
    const hand = this.oneEntry(playerId);
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
      store.dispatch(this.drawFromDeckThunk(table[0], cardIndex, hand, card));
      resolve(Response.success({
        msg: `Player ${player.get('name')} drew a card from the deck.`,
        action: DRAW_FROM_DECK,
        payload: card,
      }));
    }
  });

  drawFromPile = (playerId, gameId, card) => new Promise((resolve, reject) => {
    const hand = this.oneEntry(playerId);
    const table = Tables.oneEntry(gameId);
    if (!table) {
      reject(Response.error({ msg: 'Table does not exist.' }));
    } else if (!hand) {
      reject(Response.error({ msg: 'Player does not exist.' }));
    } else {
      const player = Players.one(playerId);
      const pile = table[1].get('pile');
      const cardIndex = pile.findKey(c => c.get('id') === card.id);
      store.dispatch(this.drawFromPileThunk(table[0], cardIndex, hand, card));
      resolve(Response.success({
        msg: `Player ${player.get('name')} drew a card from the pile.`,
        action: DRAW_FROM_PILE,
        payload: card,
      }));
    }
  });

  drawDestination = (playerId, gameId) => new Promise((resolve, reject) => {
    const hand = this.oneEntry(playerId);
    const table = Tables.oneEntry(gameId);
    if (!table) {
      reject(Response.error({ msg: 'Table does not exist.' }));
    } else if (!hand) {
      reject(Response.error({ msg: 'Player does not exist.' }));
    } else {
      const player = Players.one(playerId);
      const destinations = table[1].get('destinations');
      const destinationIndex = Math.floor(Math.random() * destinations.size);
      const destination = destinations.get(destinationIndex);
      store.dispatch(this.drawDestinationThunk(table[0], destinationIndex, hand, destination));
      resolve(Response.success({
        msg: `Player ${player.get('name')} drew a new destination.`,
        action: DRAW_DESTINATION,
        payload: destination,
      }));
    }
  });

  dealFirstHand = (playerIdList, gameId) => new Promise((resolve, reject) => {
    const table = Tables.oneEntry(gameId);
    if (!table) {
      reject(Response.error({ msg: 'Table does not exist.' }));
    } else {
      const deck = table[1].get('deck').toJS();
      const hands = [];
      playerIdList.forEach(playerId => {
        const cards = [];
        const hand = this.oneEntry(playerId);
        for (let i = 0; i < RULES.player.startingHand; i++) {
          const cardIndex = Math.floor(Math.random() * deck.length);
          const card = deck.splice(cardIndex, 1)[0];
          cards.push(card);
        }
        hands.push({
          cards,
          handIndex: hand[0],
        });
      });
      store.dispatch(this.multipleDrawFromDeckThunk(table, hands));
      resolve(Response.success({
        msg: 'Dealt first hand to all players.',
        action: MULTIPLE_DRAW_FROM_DECK,
      }));
    }
  });

  pickDestinations = (playerId, gameId, destinations) => new Promise((resolve, reject) => {
    const hand = this.oneEntry(playerId);
    const table = Tables.oneEntry(gameId);
    if (!table) {
      reject(Response.error({ msg: 'Table does not exist.' }));
    } else if (!hand) {
      reject(Response.error({ msg: 'Player does not exist.' }));
    } else {
      const player = Players.one(playerId);
      //store.dispatch(this.pickDestinationsAction(hand, fromJS(destinations)));
      store.dispatch(this.pickDestinationsThunk(hand, fromJS(destinations), table[0]));
      resolve(Response.success({
        msg: `Player ${player.get('name')} picked ${destinations.length} new destination(s).`,
        action: PICK_DESTINATIONS,
        payload: destinations,
      }));
    }
  });




  // Actions

  createAction = hand => ({
    type: CREATE_HAND,
    hand,
  });

  deleteAction = index => ({
    type: DELETE_HAND,
    index,
  });

  resetHandAction = entry => ({
    type: RESET_HAND,
    entry,
  });

  drawFromDeckAction = (entry, card) => ({
    type: DRAW_FROM_DECK,
    entry,
    card,
  });

  multipleDrawFromDeckAction = hands => ({
    type: MULTIPLE_DRAW_FROM_DECK,
    hands,
  });

  drawFromPileAction = (entry, card) => ({
    type: DRAW_FROM_PILE,
    entry,
    card,
  });

  drawDestinationAction = (entry, destination) => ({
    type: DRAW_DESTINATION,
    entry,
    destination,
  });

  pickDestinationsAction = (entry, destinations) => ({
    type: PICK_DESTINATIONS,
    entry,
    destinations,
  });




  // Helpers

  drawFromDeckThunk = (tableIndex, cardIndex, hand, card) => dispatch => {
    dispatch(Cards.removeFromDeckAction(tableIndex, cardIndex));
    dispatch(this.drawFromDeckAction(hand, card));
  };

  multipleDrawFromDeckThunk = (table, hands) => dispatch => {
    dispatch(Cards.multipleRemoveFromDeckAction(table[0],
      hands.map(h => h.cards).reduce((a, b) => a.concat(b))
    ));
    dispatch(this.multipleDrawFromDeckAction(hands));
  };

  multipleDrawFromDeckReducer = (state, action) =>
    state.map((h, i) => {
      const hand = action.hands.find(ah => ah.handIndex === i);
      if (hand) {
        return h.set('cards', h.get('cards').concat(fromJS(hand.cards)));
      } else {
        return h;
      }
    });

  drawFromPileThunk = (tableIndex, cardIndex, hand, card) => dispatch => {
    dispatch(Cards.removeFromPileAction(tableIndex, cardIndex));
    dispatch(this.drawFromPileAction(hand, fromJS(card)));
  };

  drawDestinationThunk = (tableIndex, destinationIndex, hand, destination) => dispatch => {
    dispatch(Cards.removeFromDestinationDeckAction(tableIndex, destinationIndex));
    dispatch(this.drawDestinationAction(hand, destination));
  };

  pickDestinationsThunk = (hand, destinations, tableIndex) => dispatch => {
    dispatch(Cards.multipleRemoveFromDestinationDeckAction(tableIndex, destinations));
    dispatch(this.pickDestinationsAction(hand, destinations));
  }

  pickDestinationsReducer = (state, action) =>
    state.setIn(
      [action.entry[0], 'destinations'],
      action.entry[1].get('destinations').concat(action.destinations)
    );

}

export default new Hands();
