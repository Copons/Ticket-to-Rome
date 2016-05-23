import socketIo from 'socket.io';
import * as API from '../actions';
import store from '../store';

import * as games from './async/games';
import * as players from './async/players';
import * as rooms from './async/rooms';
import * as tables from './async/tables';




export default function socket(server) {
  const io = socketIo.listen(server);

  store.subscribe(() => {
    //console.log(JSON.stringify(store.getState()));
  });

  io.on(API.CONNECTION, client => {
    console.log(`Client ${client.id} connected.`);


    client.on(API.CREATE_PLAYER, players.create.bind({ io }));

    client.on(API.CHANGE_PLAYER_NAME, players.changeName.bind({ io }));


    client.on(API.CREATE_ROOM, rooms.create.bind({ client, io }));

    client.on(API.JOIN_ROOM, rooms.join.bind({ client, io }));

    client.on(API.LEAVE_ROOM, rooms.leave.bind({ client, io }));


    client.on(API.START_GAME, games.start.bind({ io }));


    client.on(API.DRAW_FROM_DECK, tables.drawFromDeck.bind({ io }));


    client.on(API.DISCONNECT, players.disconnect.bind({ client, io }));
  });

  return io;
}
