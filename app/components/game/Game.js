//import { RULES } from '../../config';
//import { random } from '../../libs/math';
import IO from '../communications/IO';
import Message from '../communications/Message';
//import PubSub from '../communications/PubSub';
//import Player from '../player/Player';


export default class Game {

  constructor() {
    this.room = {};

    IO.io.on('Game.start', this.start);
    IO.io.on('Game.closed', this.close);
  }


  start = response => {
    console.log(response);
    this.room = response.body.room;
  }


  close = response => {
    console.log(response);
    this.room = {};
    Message.error(response.message);
  }

}
