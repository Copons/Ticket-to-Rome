import Hands from '../../services/Hands';
import Players from '../../services/Players';
import Rooms from '../../services/Rooms';


export async function create (player, callback) {
  try {
    const res = await Players.create(player);
    await Hands.create(res.payload.get('id'));
    callback(res);
    Rooms.emit(this.io.sockets);
  } catch (e) {
    callback(e);
  }
}

export async function changeName ({ id, name }, callback) {
  try {
    const res = await Players.changeName(id, name);
    callback(res);
    Rooms.emit(this.io.sockets);
  } catch (e) {
    callback(e);
  }
}

export async function reset (id, callback) {
  try {
    const res = await Players.reset(id);
    callback(res);
  } catch (e) {
    callback(e);
  }
}

export async function disconnect () {
  //try {
  const res = await Rooms.leaveAll(this.client);
  await Hands.delete(res.payload.player.get('id'));
  await Players.delete(res.payload.player.get('client'));
  Rooms.emit(this.io.sockets);
  //} catch (e) {
  //  console.error(e);
  //}
}
