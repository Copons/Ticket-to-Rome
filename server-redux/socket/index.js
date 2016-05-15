import socketIo from 'socket.io';
import * as API from '../actions';
import Games from '../services/Games';
import Players from '../services/Players';
import Response from '../services/Response';
import Rooms from '../services/Rooms';
import store from '../store';


export default function socket(server) {
  const io = socketIo.listen(server);

  store.subscribe(() => {
    //console.log(JSON.stringify(store.getState()));
  });

  io.on(API.CONNECTION, client => {
    console.log(`Client ${client.id} connected.`);




    client.on(API.CREATE_PLAYER, (player, callback) =>
      Players.create(player)
        .then(res => callback(res))
        .then(() => Rooms.emitAll(io.sockets))
    );

    client.on(API.UPDATE_PLAYER, (player, callback) =>
      Players.update(player)
        .then(res => callback(res))
        .then(() => Rooms.emitAll(io.sockets))
    );




    client.on(API.CREATE_ROOM, (room, callback) =>
      Rooms.create(room)
        .then(res => {
          Rooms.clientJoin(client, res.body.id);
          callback(res);
        })
        .then(() => Rooms.emitAll(io.sockets))
    );

    client.on(API.JOIN_ROOM, (data, callback) =>
      Rooms.join(data.roomId, data.playerId)
        .then(res => {
          Rooms.clientJoin(client, res.body.get('id'));
          callback(res);
        })
        .then(() => Rooms.emitAll(io.sockets))
    );

    client.on(API.LEAVE_ROOM, (data, callback) =>
      Rooms.leave(data.roomId, data.playerId)
        .then(res => {
          callback(res);
          return Games.kill(res.body.get('id'));
        })
        .then(gameId => Games.emitKill(gameId, io))
        .then(res => Rooms.clientLeave(client, res.body))
        .then(() => Rooms.emitAll(io.sockets))
        .catch(err => callback(err))
    );

    client.on(API.START_GAME, (roomId, callback) =>
      Games.start(roomId)
        .then(game => Games.emitStart(game, io))
        .then(() => Rooms.emitAll(io.sockets))
        .catch(err => callback(Response.error(err)))
    );




    client.on(API.DISCONNECT, () => {
      Rooms.leaveAll(client)
        .then(clientId => Players.delete(clientId))
        .then(() => Rooms.emitAll(io.sockets));
    });
  });

  return io;
}
