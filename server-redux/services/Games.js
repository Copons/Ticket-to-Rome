import { Map, fromJS } from 'immutable';
import store from '../store';
import Players from './Players';
import Response from './Response';
import Rooms from './Rooms';
import {
  START_GAME,
  KILL_GAME,
} from '../actions';


class Games {


  // Utilities

  all = () => store.getState().games;

  one = id => this.all().find(g => g.get('id') === id);

  oneEntry = id => this.all().findEntry(g => g.get('id') === id);

  oneExpanded = id => {
    const game = this.one(id);
    const room = Rooms.one(id);
    return game.set('players', room.get('players').map(p => Players.one(p)));
  };

  emitStart = (id, io) => {
    const room = Rooms.one(id);
    const res = Response.success({
      msg: `Game in room ${room.get('name')} started.`,
      action: START_GAME,
      payload: this.oneExpanded(id),
    });
    io.in(id).emit(START_GAME, res);
    return res;
  }

  emitKill = (id, io) => {
    const res = Response.success({
      msg: `Game ${id} closed.`,
      action: KILL_GAME,
    });
    io.in(id).emit(KILL_GAME, res);
  }




  // Services

  start = id => new Promise((resolve, reject) => {
    const room = Rooms.one(id);
    if (!room) {
      reject(Response.error({ msg: 'Room does not exist.' }));
    } else {
      const game = new Map(fromJS({
        id,
        turn: 0,
        active: false,
      }));
      store.dispatch(this.startAction(game));
      resolve(Response.success({
        msg: `Game in room ${room.get('name')} started.`,
        action: START_GAME,
        payload: { game, room },
      }));
    }
  });

  kill = id => new Promise(resolve => {
    const entry = this.oneEntry(id);
    if (!entry) {
      resolve();
    } else {
      store.dispatch(this.killAction(entry[0]));
      resolve(Response.success({
        msg: `Game ${entry[1].get('id')} closed.`,
        action: KILL_GAME,
        payload: entry[1],
      }));
    }
  });




  // Actions

  startAction = game => ({
    type: START_GAME,
    game,
  });

  killAction = index => ({
    type: KILL_GAME,
    index,
  });

}

export default new Games();
