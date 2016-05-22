import { Map, fromJS } from 'immutable';
import store from '../store';
import Players from './Players';
import Response from './Response';
import Rooms from './Rooms';
import {
  CREATE_HAND,
  DELETE_HAND,
  RESET_HAND,
  ALL_HANDS_IN_GAME,
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
    const room = Rooms.one(gameId);
    const hands = [];
    idList.forEach(id => {
      hands.push(this.one(id));
    });
    const res = Response.success({
      msg: `All hands in game ${room.get('name')} sent.`,
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

}

export default new Hands();
