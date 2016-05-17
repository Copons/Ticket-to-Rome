import Players from '../../services/Players';
import Rooms from '../../services/Rooms';


export async function create (player, callback) {
  try {
    const res = await Players.create(player);
    callback(res);
    Rooms.emitAll(this.io.sockets);
  } catch (e) {
    console.error(e);
  }
}

export async function update (player, callback) {
  try {
    const res = await Players.update(player);
    callback(res);
    Rooms.emitAll(this.io.sockets);
  } catch (e) {
    console.error(e);
  }
}

export async function disconnect () {
  try {
    const clientId = await Rooms.leaveAll(this.client);
    await Players.delete(clientId);
    Rooms.emitAll(this.io.sockets);
  } catch (e) {
    console.error(e);
  }
}
