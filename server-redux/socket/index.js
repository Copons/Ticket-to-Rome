import socketIo from 'socket.io';
import * as API from '../API';
import store from '../store';
import { createPlayer, updatePlayer } from '../actions';
import { createRoom, updatePlayerInRooms } from '../actions';

export default function socket(server) {
  const io = socketIo.listen(server);

  console.log(JSON.stringify(store.getState()));

  /*const unsubscribe = */
  store.subscribe(() => {
    console.log(JSON.stringify(store.getState()));
  });

  /*
  store.dispatch(deletePlayer(1));

  store.dispatch(joinRoom(1, 1));
  store.dispatch(joinRoom(1, 2));

  store.dispatch(leaveRoom(1, 1));

  store.dispatch(deleteRoom(1));
  */

  //unsubscribe();

  io.on(API.CONNECTION, client => {
    console.log(`Client ${client.id} connected.`);

    client.on(API.CREATE_PLAYER, (player, callback) => {
      store.dispatch(createPlayer(player));
      callback();
    });

    client.on(API.UPDATE_PLAYER, (player, callback) => {
      store.dispatch(updatePlayer(player));
      store.dispatch(updatePlayerInRooms(player));
      io.sockets.emit(API.SET_ROOMS, {
        type: 'success',
        body: store.getState().rooms,
      });
      callback();
    });

    client.on(API.CREATE_ROOM, (room, callback) => {
      store.dispatch(createRoom(room));
      io.sockets.emit(API.SET_ROOMS, {
        type: 'success',
        body: store.getState().rooms,
      });
      callback();
    });
  });
}
