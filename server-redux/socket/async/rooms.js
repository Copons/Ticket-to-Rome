import Games from '../../services/Games';
import Rooms from '../../services/Rooms';


export async function create (room, callback) {
  try {
    const res = await Rooms.create(room);
    const roomId = res.payload.get('id');
    await Rooms.join(roomId, res.payload.get('owner'));
    await Rooms.clientJoin(roomId, this.client);
    callback(res);
    Rooms.emit(this.io.sockets);
  } catch (e) {
    callback(e);
  }
}

export async function join ({ roomId, playerId }, callback) {
  try {
    const res = await Rooms.join(roomId, playerId);
    await Rooms.clientJoin(roomId, this.client);
    callback(res);
    Rooms.emit(this.io.sockets);
  } catch (e) {
    callback(e);
  }
}

export async function leave ({ roomId, playerId }, callback) {
  try {
    const res = await Rooms.leave(roomId, playerId);
    callback(res);
    //const gameId = await Games.kill(roomId);
    //Games.emitKill(gameId, this.io);
    await Rooms.clientLeave(roomId, this.client);
    Rooms.emit(this.io.sockets);
  } catch (e) {
    callback(e);
  }
}
