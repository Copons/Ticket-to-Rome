import { fromJS } from 'immutable';
import store from '../store';
import Response from './Response';
import { createPlayer, updatePlayer, deletePlayer, updatePlayerInRooms } from '../actions';
import { findEntryById } from '../helpers/find';

class Players {

  all = () => store.getState().players

  one = id => {
    const player = findEntryById(this.all(), id);
    if (player !== null) {
      return player[1];
    } else {
      return null;
    }
  };

  oneByClient = clientId => {
    const player = this.all().findEntry(item => clientId.includes(item.get('client')));
    if (player) {
      return player[1];
    } else {
      return null;
    }
  }

  create = player => {
    const action = store.dispatch(createPlayer(player));
    return Response.success(action.type);
  }

  update = player => {
    const action = store.dispatch(updatePlayer(player));
    store.dispatch(updatePlayerInRooms(player));
    return Response.success(action.type);
  }

  updateReducer = (state, action) => {
    const player = findEntryById(state, action.player.id);
    if (player !== null) {
      return state.set(player[0], player[1].merge(fromJS(action.player)));
    } else {
      return state;
    }
  }

  delete = clientId => {
    const player = this.oneByClient(clientId);
    let action;
    if (player) {
      action = store.dispatch(deletePlayer(player.get('id')));
      return Response.success(action.type);
    }
  }

}

export default new Players();
