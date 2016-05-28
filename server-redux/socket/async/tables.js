import Cards from '../../services/Cards';
import Hands from '../../services/Hands';
import Games from '../../services/Games';
import Tables from '../../services/Tables';

export async function drawFromDeck ({ playerId, gameId }, callback) {
  try {
    const res = await Hands.drawFromDeck(playerId, gameId);
    callback(res);
    Games.emit(gameId, this.io);
    Tables.emit(gameId, this.io);
  } catch (e) {
    console.error(e);
    callback(e);
  }
}

export async function drawFromPile ({ playerId, gameId, card }, callback) {
  try {
    const res = await Hands.drawFromPile(playerId, gameId, card);
    callback(res);
    await Cards.fillPile(gameId);
    Games.emit(gameId, this.io);
    Tables.emit(gameId, this.io);
  } catch (e) {
    console.error(e);
    callback(e);
  }
}

export async function drawDestination ({ playerId, gameId }, callback) {
  try {
    const res = await Hands.drawDestination(playerId, gameId);
    callback(res);
    Games.emit(gameId, this.io);
    Tables.emit(gameId, this.io);
  } catch (e) {
    console.error(e);
    callback(e);
  }
}

export async function pickDestinations ({ playerId, gameId, destinations }, callback) {
  try {
    const res = await Hands.pickDestinations(playerId, gameId, destinations);
    callback(res);
    if (Games.emitIfGameIsReady(gameId, this.io)) {
      await Games.removeSetup(gameId);
      Games.emit(gameId, this.io);
      Tables.emit(gameId, this.io);
    }
  } catch (e) {
    console.error(e);
    callback(e);
  }
}
