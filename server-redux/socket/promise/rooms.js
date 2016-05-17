import Games from '../../services/Games';
import Rooms from '../../services/Rooms';


export function create (room, callback) {
  Rooms.create(room)
    .then(res => {
      Rooms.clientJoin(this.client, res.body.id);
      callback(res);
    })
    .then(() => Rooms.emitAll(this.io.sockets));
}

export function join (data, callback) {
  Rooms.join(data.roomId, data.playerId)
    .then(res => {
      Rooms.clientJoin(this.client, res.body.get('id'));
      callback(res);
    })
    .then(() => Rooms.emitAll(this.io.sockets));
}

export function leave (data, callback) {
  Rooms.leave(data.roomId, data.playerId)
    .then(res => {
      callback(res);
      return Games.kill(res.body.get('id'));
    })
    .then(gameId => Games.emitKill(gameId, this.io))
    .then(res => Rooms.clientLeave(this.client, res.body))
    .then(() => Rooms.emitAll(this.io.sockets))
    .catch(err => callback(err));
}
