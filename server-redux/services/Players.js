import { Map, fromJS } from 'immutable';
import uuid from 'node-uuid';
import store from '../store';
import { DECK } from '../config/deck';
import Response from './Response';
import {
  CREATE_PLAYER,
  CHANGE_PLAYER_NAME,
  SET_PLAYER_COLOR,
  RESET_PLAYER_STATS,
  DELETE_PLAYER,
} from '../actions';


class Players {


  // Utilities

  all = () => store.getState().players;

  one = id => this.all().find(p => p.get('id') === id);

  oneByClient = clientId => this.all().find(p => clientId.includes(p.get('client')));

  oneEntry = id => this.all().findEntry(p => p.get('id') === id);

  oneSimple = id => {
    const player = this.one(id);
    return {
      id: player.get('id'),
      name: player.get('name'),
    };
  };


  resetStats = () => ({
    colors: '',
    points: 0,
    pieces: 0,
  });




  // Services

  create = player => new Promise(resolve => {
    const newPlayer = new Map(fromJS({
      ...player,
      ...this.resetStats(),
      id: uuid.v4(),
    }));
    store.dispatch(this.createAction(newPlayer));
    resolve(Response.success({
      msg: `Player ${newPlayer.get('name')} created.`,
      action: CREATE_PLAYER,
      payload: newPlayer,
    }));
  });

  changeName = (id, name) => new Promise((resolve, reject) => {
    const entry = this.oneEntry(id);
    if (!entry) {
      reject(Response.error({ msg: 'Player does not exist.' }));
    } else {
      store.dispatch(this.changeNameAction(entry, name));
      resolve(Response.success({
        msg: `Player ${name} updated.`,
        action: CHANGE_PLAYER_NAME,
        payload: { name },
      }));
    }
  });

  setColors = playerIdList => new Promise(resolve => {
    playerIdList.forEach((id, i) => {
      store.dispatch(this.setColorAction(this.oneEntry(id), DECK[i].type));
    });
    resolve(Response.success({
      msg: 'Colors updated.',
      action: SET_PLAYER_COLOR,
    }));
  });

  reset = id => new Promise((resolve, reject) => {
    const entry = this.oneEntry(id);
    if (!entry) {
      reject(Response.error({ msg: 'Player does not exist.' }));
    } else {
      store.dispatch(this.resetStatsAction(entry));
      resolve(Response.success({
        msg: `Player ${entry[1].get('name')} reset.`,
        action: RESET_PLAYER_STATS,
        payload: { ...this.resetStats() },
      }));
    }
  });

  delete = (clientId = '') => new Promise((resolve, reject) => {
    const player = this.oneByClient(clientId);
    if (!player) {
      reject(Response.error({ msg: `Client ${clientId} does not exist.` }));
    } else {
      store.dispatch(this.deleteAction(player.get('id')));
      resolve(Response.success({
        msg: `Client ${clientId} deleted.`,
        action: DELETE_PLAYER,
      }));
    }
  });




  // Actions

  createAction = player => ({
    type: CREATE_PLAYER,
    player,
  });

  changeNameAction = (entry, name) => ({
    type: CHANGE_PLAYER_NAME,
    entry,
    name,
  });

  setColorAction = (entry, color) => ({
    type: SET_PLAYER_COLOR,
    entry,
    color,
  });

  resetStatsAction = entry => ({
    type: RESET_PLAYER_STATS,
    entry,
  });

  deleteAction = id => ({
    type: DELETE_PLAYER,
    id,
  });

}

export default new Players();
