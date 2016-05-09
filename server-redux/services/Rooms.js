import store from '../store';
import Players from './Players';
import Response from './Response';
import {
  SET_ROOMS,
  CREATE_ROOM,
  JOIN_ROOM,
  LEAVE_ROOM,
  CHANGE_ROOM_STATUS,
} from '../actions/actionTypes';
import { createRoom, joinRoom, leaveRoom, deleteRoom, updatePlayerInRooms } from '../actions';


class Rooms {


  all = () => store.getState().rooms;

  one = id => this.all().find(r => r.get('id') === id);


  humanizeOne = room => {
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


  humanizeAll = () => this.all().map(room => this.humanizeOne(room));


  emitAll = clients => {
    const response = Response.success(SET_ROOMS, this.humanizeAll());
    clients.emit(SET_ROOMS, response);
    return response;
  }


  containsPlayer = (roomId, playerId) => {
    const room = this.one(roomId);
    return room && room.get('players').indexOf(playerId) > -1;
  }


  create = (room, client) => {
    store.dispatch(this.createThunk({
      ...room,
      players: [],
      status: 'open',
    }));
    client.join(room.id);
    return Response.success(CREATE_ROOM);
  }


  createThunk = room => dispatch => {
    dispatch(createRoom(room));
    dispatch(joinRoom(room.id, room.owner));
  };


  join = (roomId, playerId, client) => {
    const action = store.dispatch(joinRoom(roomId, playerId));
    client.join(roomId);
    return Response.success(action.type);
  }


  leave = (roomId, playerId, client) => {
    const room = this.one(roomId);
    if (!room) return Response.error(LEAVE_ROOM);

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


  leaveAll = client => new Promise((resolve, reject) => {
    const player = Players.oneByClient(client.id);
    if (!player) {
      reject();
    } else {
      const rooms = this.all().map(r => r.get('id'));
      for (const roomId of rooms) {
        this.leave(roomId, player.get('id'), client);
      }
      resolve(client.id);
    }
  });


  updateReducer = (state, action) => {
    const room = state.findEntry(r => r.get('id') === action.roomId);
    if (!room) return state;

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
      case CHANGE_ROOM_STATUS:
        return state.set(
          room[0],
          room[1].set('status', action.status)
        );
      default:
        return state;
    }
  }


  updatePlayer = player => {
    const action = store.dispatch(updatePlayerInRooms(player));
    return Response.success(action.type);
  }


  updatePlayerReducer = (state, action) => state.map(r => {
    if (r.get('owner') === action.player.id) {
      return r.merge({ owner: action.player.id });
    } else {
      return r;
    }
  });

}

export default new Rooms();
