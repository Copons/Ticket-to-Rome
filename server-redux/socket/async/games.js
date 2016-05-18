import Games from '../../services/Games';
import Response from '../../services/Response';
import Rooms from '../../services/Rooms';
import Tables from '../../services/Tables';

export async function start (id, callback) {
  try {
    const game = await Games.start(id);
    await Tables.emitOne(game.get('id'), this.io);
    await Games.emitStart(game, this.io);
    Rooms.emitAll(this.io.sockets);
  } catch (e) {
    callback(Response.error(e));
  }
}
