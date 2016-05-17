import Players from '../../services/Players';
import Rooms from '../../services/Rooms';


export function create (player, callback) {
  Players.create(player)
    .then(res => callback(res))
    .then(() => Rooms.emitAll(this.io.sockets));
}

export function update (player, callback) {
  Players.update(player)
    .then(res => callback(res))
    .then(() => Rooms.emitAll(this.io.sockets));
}

export function disconnect () {
  Rooms.leaveAll(this.client)
    .then(clientId => Players.delete(clientId))
    .then(() => Rooms.emitAll(this.io.sockets));
}
