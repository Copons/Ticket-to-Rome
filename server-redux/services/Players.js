import { fromJS } from 'immutable';
import store from '../store';
import Response from './Response';
import { DELETE_PLAYER } from '../actions/actionTypes';
import { createPlayer, updatePlayer, deletePlayer, updatePlayerInRooms } from '../actions';


class Players {

  all = () => store.getState().players;

  one = id => this.all().find(p => p.get('id') === id);

  oneByClient = clientId => this.all().find(p => clientId.includes(p.get('client')));


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
    const player = state.findEntry(p => p.get('id') === action.player.id);
    if (!player) return state;

    return state.set(
      player[0],
      player[1].merge(fromJS(action.player))
    );
  }


  delete = clientId => {
    const player = this.oneByClient(clientId);
    if (!player) return Response.error(DELETE_PLAYER);

    const action = store.dispatch(deletePlayer(player.get('id')));
    return Response.success(action.type);
  }

}

export default new Players();
