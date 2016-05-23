import Cards from '../../services/Cards';
import Games from '../../services/Games';
import Tables from '../../services/Tables';

export async function drawFromDeck ({ playerId, gameId }, callback) {
  try {
    const res = await Cards.drawFromDeck(playerId, gameId);
    callback(res);
    Games.emit(gameId, this.io);
    Tables.emit(gameId, this.io);
  } catch (e) {
    callback(e);
  }
}
