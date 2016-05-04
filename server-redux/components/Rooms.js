import store from '../store';
import Players from './Players';
import Response from './Response';
import { SET_ROOMS, CREATE_ROOM, JOIN_ROOM, LEAVE_ROOM } from '../actions/actionTypes';
import { createRoom, joinRoom, updateRoom, updatePlayerInRooms } from '../actions';
import { findEntryById } from '../helpers/find';

class Rooms {

  all = () => store.getState().rooms

  one = id => {
    const room = findEntryById(this.all(), id);
    if (room === null) return null;
    else return room[1];
  }

  oneReadable = room => {
    const owner = Players.one(room.get('owner')).get('name');
    const players = room.get('players').map(p => {
      const player = Players.one(p);
      return {
        id: player.get('id'),
        name: player.get('name'),
      };
    });
    return room.merge({ owner, players });
  }

  allReadable = () => this.all().map(room => this.oneReadable(room))

  emitAll = clients => {
    clients.emit(SET_ROOMS, Response.success(SET_ROOMS, this.allReadable()));
  }

  create = room => {
    const newRoom = {
      ...room,
      players: [],
    };
    store.dispatch(this.createThunk(newRoom));
    return Response.success(CREATE_ROOM);
  }

  createThunk = room =>
    dispatch => {
      dispatch(createRoom(room));
      dispatch(joinRoom(room.id, room.owner));
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
