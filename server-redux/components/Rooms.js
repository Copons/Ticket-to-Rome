import store from '../store';
import Players from './Players';
import Response from './Response';
import { SET_ROOMS, CREATE_ROOM, JOIN_ROOM, LEAVE_ROOM } from '../actions/actionTypes';
import { createRoom, joinRoom, leaveRoom, deleteRoom, updatePlayerInRooms } from '../actions';
import { findEntryById } from '../helpers/find';

class Rooms {

  all = () => store.getState().rooms

  one = id => {
    const room = findEntryById(this.all(), id);
    if (room === null) return null;
    else return room[1];
  }

  oneReadable = room => {
    const owner = Players.one(room.get('owner'));
    const players = room.get('players').map(p => {
      const player = Players.one(p);
      return {
        id: player.get('id'),
        name: player.get('name'),
      };
    });
    return room.merge({
      players,
      owner: {
        id: owner.get('id'),
        name: owner.get('name'),
      },
    });
  }

  allReadable = () => this.all().map(room => this.oneReadable(room))

  emitAll = clients => {
    clients.emit(SET_ROOMS, Response.success(SET_ROOMS, this.allReadable()));
  }

  containsPlayer = (roomId, playerId) => {
    const room = this.one(roomId);
    if (room && room.get('players').indexOf(playerId) > -1) return true;
    else return false;
  }

  create = (room, client) => {
    const newRoom = {
      ...room,
      players: [],
      status: 'open',
    };
    store.dispatch(this.createThunk(newRoom));
    client.join(room.id);
    return Response.success(CREATE_ROOM);
  }

  createThunk = room =>
    dispatch => {
      dispatch(createRoom(room));
      dispatch(joinRoom(room.id, room.owner));
    }

  join = (roomId, playerId, client) => {
    const action = store.dispatch(joinRoom(roomId, playerId));
    client.join(roomId);
    return Response.success(action.type);
  }

  leave = (roomId, playerId, client) => {
    const room = this.one(roomId);
    if (!room) {
      return Response.error(LEAVE_ROOM);
    }

    let action;
    if (
      room.get('owner') === playerId ||
      room.get('players').size === 1 && this.containsPlayer(room.get('id'), playerId)
    ) {
      action = store.dispatch(deleteRoom(roomId));
    } else {
      action = store.dispatch(leaveRoom(roomId, playerId));
    }
    client.leave(roomId);

    return Response.success(action.type);
  }

  leaveAll = client =>
    new Promise((resolve, reject) => {
      const player = Players.oneByClient(client.id);
      if (!player) {
        reject();
      }
      const rooms = this.all().map(room => room.get('id'));
      for (const roomId of rooms) {
        this.leave(roomId, player.get('id'), client);
      }
      resolve(client.id);
    })

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
