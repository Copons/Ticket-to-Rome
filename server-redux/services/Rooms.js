import uuid from 'node-uuid';
import store from '../store';
import Games from './Games';
import Players from './Players';
import Response from './Response';
import {
  SET_ROOMS,
  CREATE_ROOM,
  JOIN_ROOM,
  LEAVE_ROOM,
  DELETE_ROOM,
  CHANGE_ROOM_STATUS,
} from '../actions';


class Rooms {


  // Utilities

  all = () => store.getState().rooms;

  one = id => this.all().find(r => r.get('id') === id);


  emitAll = clients => {
    const response = Response.success(SET_ROOMS, this.all().toJS());
    clients.emit(SET_ROOMS, response);
    return response;
  }


  containsPlayer = (roomId, playerId) => {
    const room = this.one(roomId);
    if (!room) return false;
    let foundPlayer = false;
    room.get('players').forEach(p => {
      if (p.get('id') === playerId) {
        foundPlayer = true;
        return false;
      }
    });
    return foundPlayer;
  }



  // Services

  create = room => new Promise(resolve => {
    const newRoom = {
      id: uuid.v4(),
      name: room.name,
      owner: {
        id: room.owner,
        name: Players.one(room.owner).get('name'),
      },
      players: [],
      status: 'open',
    };
    store.dispatch(this.createThunk(newRoom));
    resolve(Response.success(`Created room ${newRoom.name}.`, newRoom));
  });


  join = (roomId, playerId) => new Promise(resolve => {
    const room = this.one(roomId);
    const player = Players.one(playerId);
    store.dispatch(this.joinRoomAction(roomId, player));
    resolve(Response.success(`Joined room ${room.get('name')}.`, room));
  });


  leave = (roomId, playerId) => new Promise((resolve, reject) => {
    const room = this.one(roomId);
    if (!room) {
      reject(Response.error('Error in leaving room.'));
    } else {
      if (
        room.get('owner').get('id') === playerId ||
        room.get('players').size === 1 && this.containsPlayer(room.get('id'), playerId)
      ) {
        store.dispatch(this.deleteRoomAction(roomId));
      } else {
        store.dispatch(this.leaveRoomAction(roomId, playerId));
      }
      resolve(Response.success(`Left room ${room.get('name')}.`, room));
    }
  });


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


  clientJoin = (client, roomId) => new Promise(resolve => {
    client.join(roomId);
    console.log(`Client ${client.id} joined socket room ${roomId}`);
    resolve(roomId);
  });


  clientLeave = (client, roomId) => new Promise(resolve => {
    client.leave(roomId);
    console.log(`Client ${client.id} left socket room ${roomId}`);
    resolve(roomId);
  });




  // Actions

  createRoomAction = room => ({
    type: CREATE_ROOM,
    room,
  });

  joinRoomAction = (roomId, player) => ({
    type: JOIN_ROOM,
    roomId,
    player,
  });

  leaveRoomAction = (roomId, playerId) => ({
    type: LEAVE_ROOM,
    roomId,
    playerId,
  });

  deleteRoomAction = id => ({
    type: DELETE_ROOM,
    id,
  });

  changeRoomStatusAction = (roomId, status) => ({
    type: CHANGE_ROOM_STATUS,
    roomId,
    status,
  });



  // Helpers

  createThunk = room => dispatch => {
    dispatch(this.createRoomAction(room));
    dispatch(this.joinRoomAction(room.id, room.owner));
  };


  leaveThunk = (roomId, playerId) => dispatch => {
    dispatch(Games.killGameAction(roomId));
    dispatch(this.leaveRoomAction(roomId, playerId));
  };


  updateReducer = (state, action) => {
    const room = state.findEntry(r => r.get('id') === action.roomId);
    if (!room) return state;

    switch (action.type) {
      case JOIN_ROOM:
        return state.set(
          room[0],
          room[1].merge({
            players: room[1].get('players').push(action.player),
          })
        );
      case LEAVE_ROOM:
        return state.set(
          room[0],
          room[1].merge({
            players: room[1].get('players').filter(p => p.get('id') !== action.playerId),
          })
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

}

export default new Rooms();
