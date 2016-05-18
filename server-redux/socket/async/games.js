import Games from '../../services/Games';
import Players from '../../services/Players';
import Rooms from '../../services/Rooms';
import Tables from '../../services/Tables';

export async function start (id, callback) {
  try {
    const res = await Games.start(id);
    await Rooms.changeStatus(id, 'playing');
    await Players.setColors(res.payload.room.get('players'));
    //await Tables.create(id);
    //await Tables.emitOne(game.get('id'), this.io);
    await Games.emitStart(id, this.io);
    Rooms.emit(this.io.sockets);
  } catch (e) {
    callback(e);
  }
}

export async function kill (id, callback) {
  try {
    await Games.kill(id);
    await Rooms.changeStatus(id, 'open');
    await Tables.delete(id);
    await Games.emitKill(id, this.io);
    Rooms.emit(this.io.sockets);
  } catch (e) {
    callback(e);
  }
}