import { fromJS } from 'immutable';
import store from '../store';
import Response from './Response';
import {
  CREATE_PLAYER,
  UPDATE_PLAYER,
  DELETE_PLAYER,
} from '../actions';


class Players {


  // Utilities

  all = () => store.getState().players;

  one = id => this.all().find(p => p.get('id') === id);

  oneByClient = clientId => this.all().find(p => clientId.includes(p.get('client')));




  // Services

  create = player => new Promise(resolve => {
    store.dispatch(this.createPlayerAction(player));
    resolve(Response.success(`Player ${player.name} created.`));
  });


  update = player => new Promise(resolve => {
    store.dispatch(this.updatePlayerAction(player));
    resolve(Response.success(`Player ${player.name} updated.`));
  });


  delete = clientId => new Promise((resolve, reject) => {
    const player = this.oneByClient(clientId);
    if (!player) {
      reject(Response.error(`Error in deleting player ${clientId}.`));
    } else {
      store.dispatch(this.deletePlayerAction(player.get('id')));
      resolve(Response.success(`Player ${player.name} deleted.`));
    }
  });




  // Actions

  createPlayerAction = player => ({
    type: CREATE_PLAYER,
    player,
  });

  updatePlayerAction = player => ({
    type: UPDATE_PLAYER,
    player,
  });

  deletePlayerAction = id => ({
    type: DELETE_PLAYER,
    id,
  });




  // Helpers

  updateReducer = (state, action) => {
    const player = state.findEntry(p => p.get('id') === action.player.id);
    if (!player) return state;

    return state.set(
      player[0],
      player[1].merge(fromJS(action.player))
    );
  }

}

export default new Players();
