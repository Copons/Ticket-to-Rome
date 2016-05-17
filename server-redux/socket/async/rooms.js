import Games from '../../services/Games';
import Rooms from '../../services/Rooms';


export async function create (room, callback) {
  try {
    const res = await Rooms.create(room);
    await Rooms.clientJoin(this.client, res.body.id);
    callback(res);
    Rooms.emitAll(this.io.sockets);
  } catch (e) {
    console.error(e);
  }
}

export async function join (data, callback) {
  try {
    const res = await Rooms.join(data.roomId, data.playerId);
    await Rooms.clientJoin(this.client, res.body.get('id'));
    callback(res);
    Rooms.emitAll(this.io.sockets);
  } catch (e) {
    console.error(e);
  }
}

export async function leave (data, callback) {
  try {
    const res = await Rooms.leave(data.roomId, data.playerId);
    callback(res);
    const gameId = await Games.kill(res.body.get('id'));
    const res2 = Games.emitKill(gameId, this.io);
    await Rooms.clientLeave(this.client, res2.body);
    Rooms.emitAll(this.io.sockets);
  } catch (e) {
    callback(e);
    console.error(e);
  }
}
