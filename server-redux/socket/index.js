import socketIo from 'socket.io';
import * as API from '../actions/actionTypes';
import store from '../store';
import Players from '../components/Players';
import Rooms from '../components/Rooms';
import { createRoom } from '../actions';

export default function socket(server) {
  const io = socketIo.listen(server);

  /*const unsubscribe =
  store.subscribe(() => {
    console.log(JSON.stringify(store.getState()));
  });*/

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
      Players.create(player);
      callback();
    });

    client.on(API.UPDATE_PLAYER, (player, callback) => {
      Players.update(player);
      Rooms.emitAll(io.sockets);
      callback();
    });

    client.on(API.CREATE_ROOM, (room, callback) => {
      Rooms.create(room);
      Rooms.emitAll(io.sockets);
      callback();
    });
  });
}
