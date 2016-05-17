import Games from '../../services/Games';
import Response from '../../services/Response';
import Rooms from '../../services/Rooms';
import Tables from '../../services/Tables';

export function start (id, callback) {
  Games.start(id)
    .then(game => Games.emitStart(game, this.io))
    .then(res => Tables.emitOne(res.body.get('id'), this.io))
    .then(() => Rooms.emitAll(this.io.sockets))
    .catch(err => callback(Response.error(err)));
}
