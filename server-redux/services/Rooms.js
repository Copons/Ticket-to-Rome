import { Map, fromJS } from 'immutable';
import uuid from 'node-uuid';
import store from '../store';
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

  oneEntry = id => this.all().findEntry(r => r.get('id') === id);

  oneExpanded = room => ({
    ...room,
    owner: Players.oneSimple(room.owner),
    players: room.players.map(p => Players.oneSimple(p)),
  });

  emit = clients => {
    const rooms = this.all().toJS().map(r => this.oneExpanded(r));
    const res = Response.success({
      msg: SET_ROOMS,
      action: SET_ROOMS,
      payload: rooms,
    });
    clients.emit(SET_ROOMS, res);
    return res;
  }




  // Services

  create = room => new Promise(resolve => {
    const newRoom = new Map(fromJS({
      id: uuid.v4(),
      name: room.name,
      owner: room.owner,
      players: [],
      status: 'open',
    }));
    store.dispatch(this.createAction(newRoom));
    resolve(Response.success({
      msg: `Room ${newRoom.get('name')} created.`,
      action: CREATE_ROOM,
      payload: newRoom,
    }));
  });

  join = (roomId, playerId) => new Promise((resolve, reject) => {
    const entry = this.oneEntry(roomId);
    const player = Players.one(playerId);
    if (!entry) {
      reject(Response.error({ msg: 'Room does not exist.' }));
    } else if (!player) {
      reject(Response.error({ msg: 'Player does not exist.' }));
    } else {
      store.dispatch(this.joinAction(entry, playerId));
      resolve(Response.success({
        msg: `Player ${player.get('name')} joined room ${entry[1].get('name')}.`,
        action: JOIN_ROOM,
      }));
    }
  });

  leave = (roomId, playerId) => new Promise((resolve, reject) => {
    const entry = this.oneEntry(roomId);
    const player = Players.one(playerId);
    if (!entry) {
      reject(Response.error({ msg: 'Room does not exist.' }));
    } else if (!player) {
      reject(Response.error({ msg: 'Player does not exist.' }));
    } else {
      const room = entry[1];
      if (
        room.get('owner') === playerId ||
        room.get('players').size === 1 && room.get('players').includes(playerId)
      ) {
        store.dispatch(this.deleteAction(entry[0]));
        resolve(Response.success({
          msg: `Room ${entry[1].get('name')} deleted.`,
          action: DELETE_ROOM,
        }));
      } else {
        store.dispatch(this.leaveAction(entry, playerId));
        resolve(Response.success({
          msg: `Player ${player.get('name')} left room ${entry[1].get('name')}.`,
          action: LEAVE_ROOM,
        }));
      }
    }
  });

  leaveAll = client => new Promise((resolve, reject) => {
    const player = Players.oneByClient(client.id);
    if (!player) {
      reject();
    } else {
      this.all().forEach(r => {
        this.leave(r.get('id'), player.get('id'));
      });
      resolve(Response.success({
        msg: `Client ${client.id} left all rooms.`,
        action: LEAVE_ROOM,
      }));
    }
  });

  changeStatus = (roomId, status) => new Promise((resolve, reject) => {
    const entry = this.oneEntry(roomId);
    if (!entry) {
      reject(Response.error({ msg: 'Room does not exist.' }));
    } else {
      store.dispatch(this.changeStatusAction(entry, status));
      resolve(Response.success({
        msg: `Room ${entry[1].get('name')} is now ${status}.`,
        action: CHANGE_ROOM_STATUS,
        payload: status,
      }));
    }
  });

  clientJoin = (roomId, client) => new Promise(resolve => {
    client.join(roomId);
    resolve(Response.success({
      msg: `Client ${client.id} joined socket room ${roomId}`,
      action: JOIN_ROOM,
    }));
  });

  clientLeave = (roomId, client) => new Promise(resolve => {
    client.leave(roomId);
    resolve(Response.success({
      msg: `Client ${client.id} left socket room ${roomId}`,
      action: LEAVE_ROOM,
    }));
  });

  delete = id => new Promise((resolve, reject) => {
    const entry = this.oneEntry(id);
    if (!entry) {
      reject();
    } else {
      store.dispatch(this.deleteAction(entry[0]));
      resolve(Response.success({
        msg: `Room ${entry[1].get('id')} deleted.`,
        action: DELETE_ROOM,
        payload: entry[1],
      }));
    }
  });




  // Actions

  createAction = room => ({
    type: CREATE_ROOM,
    room,
  });

  joinAction = (entry, playerId) => ({
    type: JOIN_ROOM,
    entry,
    playerId,
  });

  leaveAction = (entry, playerId) => ({
    type: LEAVE_ROOM,
    entry,
    playerId,
  });

  deleteAction = index => ({
    type: DELETE_ROOM,
    index,
  });

  changeStatusAction = (entry, status) => ({
    type: CHANGE_ROOM_STATUS,
    entry,
    status,
  });

}

export default new Rooms();
