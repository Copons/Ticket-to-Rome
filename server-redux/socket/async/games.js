import Cards from '../../services/Cards';
import Hands from '../../services/Hands';
import Games from '../../services/Games';
import Players from '../../services/Players';
import Rooms from '../../services/Rooms';
import Tables from '../../services/Tables';

export async function setup (id, callback) {
  try {
    const res = await Games.setup(id);
    await Rooms.changeStatus(id, 'playing');
    await Players.setColors(res.payload.room.get('players'));
    await Hands.resetAllInGame(res.payload.room.get('players'));
    await Tables.create(id);
    await Cards.createDeck(id);
    await Cards.createDestinationDeck(id);
    await Cards.fillPile(id);
    const destinations = await Cards.multipleDrawDestinations(id);
    await Games.addDestinationsToChoose(id, destinations);
    await Hands.dealFirstHand(res.payload.room.get('players'), id);
    await Tables.emit(id, this.io);
    await Games.emitSetup(id, this.io);
    await Hands.emitAllInGame(id, res.payload.room.get('players'), this.io);
    Rooms.emit(this.io.sockets);
  } catch (e) {
    console.error(e);
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
