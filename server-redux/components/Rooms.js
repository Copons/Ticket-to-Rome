import store from '../store';
import Players from './Players';
import Response from './Response';
import { SET_ROOMS, JOIN_ROOM, LEAVE_ROOM } from '../actions/actionTypes';
import { createRoom, updateRoom, updatePlayerInRooms } from '../actions';
import { findEntryById } from '../helpers/find';

class Rooms {

  all = () => store.getState().rooms

  one = id => {
    const room = findEntryById(this.all(), id);
    if (room === null) return null;
    else return room[1];
  }

  oneReadable = room => {
    const player = Players.one(room.get('owner'));
    return room.merge({ owner: player.get('name') });
  }

  allReadable = () => this.all().map(room => this.oneReadable(room))

  emitAll = clients => {
    clients.emit(SET_ROOMS, Response.success(SET_ROOMS, this.allReadable()));
  }

  create = room => {
    const action = store.dispatch(createRoom(room));
    return Response.success(action.type);
  }

  update = room => {
    const action = store.dispatch(updateRoom(room));
    return Response.success(action.type);
  }

  updateReducer = (state, action) => {
    const room = findEntryById(state, action.roomId);
    if (room !== null) {
      switch (action.type) {
        case JOIN_ROOM:
          return state.set(
            room[0],
            room[1].merge({ players: room[1].get('players').push(action.playerId) })
          );
        case LEAVE_ROOM:
          return state.set(
            room[0],
            room[1].merge({ players: room[1].get('players').filter(p => p !== action.playerId) })
          );
        default:
          return state;
      }
    } else {
      return state;
    }
  }

  updatePlayer = player => {
    const action = store.dispatch(updatePlayerInRooms(player));
    return Response.success(action.type);
  }

  updatePlayerReducer = (state, action) =>
    state.map(room => {
      if (room.get('owner') === action.player.id) {
        return room.merge({ owner: action.player.id });
      } else {
        return room;
      }
    })

}

export default new Rooms();
