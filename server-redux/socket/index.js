import socketIo from 'socket.io';
import * as API from '../actions';
import Games from '../services/Games';
import Players from '../services/Players';
import Rooms from '../services/Rooms';
import store from '../store';

export default function socket(server) {
  const io = socketIo.listen(server);

  /*const unsubscribe = */
  store.subscribe(() => {
    //console.log(JSON.stringify(store.getState()));
  });

  //unsubscribe();

  io.on(API.CONNECTION, client => {
    console.log(`Client ${client.id} connected.`);

    client.on(API.CREATE_PLAYER, (player, callback) => {
      Players.create(player)
        .then(res => {
          callback(res);
        });
    });

    client.on(API.UPDATE_PLAYER, (player, callback) => {
      Players.update(player)
        .then(res => {
          Rooms.emitAll(io.sockets);
          callback(res);
        });
    });

    client.on(API.CREATE_ROOM, (room, callback) => {
      Rooms.create(room, client)
        .then(res => {
          Rooms.emitAll(io.sockets);
          callback(res);
        });
    });

    client.on(API.JOIN_ROOM, (data, callback) => {
      Rooms.join(data.roomId, data.playerId, client)
        .then(res => {
          Rooms.emitAll(io.sockets);
          callback(res);
        });
    });

    client.on(API.LEAVE_ROOM, (data, callback) => {
      Rooms.leave(data.roomId, data.playerId, client)
        .then(res => {
          Rooms.emitAll(io.sockets);
          callback(res);
        })
        .catch(err => {
          callback(err);
        });
    });

    client.on(API.START_GAME, (roomId, callback) => {
      Games.start(roomId)
        .then(res => {
          Rooms.emitAll(io.sockets);
          callback(res);
        })
        .catch(err => {
          callback(err);
        });
    });

    client.on(API.DISCONNECT, () => {
      Rooms.leaveAll(client)
        .then(clientId => Players.delete(clientId))
        .then(() => Rooms.emitAll(io))
        .catch(err => {
          console.log(err);
        });
    });
  });

  return io;
}
