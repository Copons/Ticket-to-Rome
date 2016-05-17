import Games from '../../services/Games';
import Response from '../../services/Response';
import Rooms from '../../services/Rooms';
import Tables from '../../services/Tables';

export async function start (id, callback) {
  try {
    const game = await Games.start(id);
    const res = await Games.emitStart(game, this.io);
    await Tables.emitOne(res.body.get('id'), this.io);
    Rooms.emitAll(this.io.sockets);
  } catch (e) {
    callback(Response.error(e));
  }
}
