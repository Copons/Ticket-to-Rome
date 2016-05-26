import { Map, fromJS } from 'immutable';
import store from '../store';
import Hands from './Hands';
import Players from './Players';
import Response from './Response';
import Rooms from './Rooms';
import {
  SET_GAME,
  START_GAME_SETUP,
  KILL_GAME,
  ADD_DESTINATIONS_TO_CHOOSE,
} from '../actions';


class Games {


  // Utilities

  all = () => store.getState().games;

  one = id => this.all().find(g => g.get('id') === id);

  oneEntry = id => this.all().findEntry(g => g.get('id') === id);

  oneExpanded = id => {
    const game = this.one(id);
    const room = Rooms.one(id);
    return game.set('players', room.get('players').map(p => {
      const hand = Hands.one(p);
      return Players.one(p)
        .set('cards', hand.get('cards').size)
        .set('destinations', hand.get('destinations').size);
    }));
  };

  emit = (id, io) => {
    const res = Response.success({
      msg: SET_GAME,
      action: SET_GAME,
      payload: this.oneExpanded(id),
    });
    io.in(id).emit(SET_GAME, res);
    return res;
  };

  emitSetup = (id, io) => {
    const room = Rooms.one(id);
    const res = Response.success({
      msg: `Game setup in room ${room.get('name')} started.`,
      action: START_GAME_SETUP,
      payload: {
        ...this.oneExpanded(id).toJS(),
      },
    });
    io.in(id).emit(START_GAME_SETUP, res);
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

  setup = id => new Promise((resolve, reject) => {
    const room = Rooms.one(id);
    if (!room) {
      reject(Response.error({ msg: 'Room does not exist.' }));
    } else {
      const game = new Map(fromJS({
        id,
        turn: 0,
        active: false,
        setup: {
          destinationsToChoose: [],
          chosenDestinations: [],
        },
      }));
      store.dispatch(this.startSetupAction(game));
      resolve(Response.success({
        msg: `Game setup in room ${room.get('name')} started.`,
        action: START_GAME_SETUP,
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

  addDestinationsToChoose = (id, destinations) => new Promise((resolve, reject) => {
    const room = Rooms.one(id);
    const game = this.oneEntry(id);
    if (!room) {
      reject(Response.error({ msg: 'Game does not exist.' }));
    } else {
      const mappedDestinations = this.mapSetupDestinationsToPlayers(destinations, room);
      store.dispatch(this.addDestinationsToChooseAction(game[0], fromJS(mappedDestinations)));
      resolve(Response.success({
        msg: `Added destinations to choose in game ${id}.`,
        action: ADD_DESTINATIONS_TO_CHOOSE,
        payload: mappedDestinations,
      }));
    }
  });




  // Actions

  startSetupAction = game => ({
    type: START_GAME_SETUP,
    game,
  });

  killAction = index => ({
    type: KILL_GAME,
    index,
  });

  addDestinationsToChooseAction = (index, destinations) => ({
    type: ADD_DESTINATIONS_TO_CHOOSE,
    index,
    destinations,
  });




  // Helpers

  mapSetupDestinationsToPlayers = (destinations, room) => {
    const players = room.get('players');
    let i = 0;
    return destinations.map(destination => {
      const player = players.get(Math.floor(i / 3));
      i++;
      return {
        player,
        destination,
      };
    });
  };

}

export default new Games();
