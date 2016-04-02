import { sessionSet, sessionGet, sessionRemove } from '../../libs/storage';
import IO from '../communications/IO';
import Message from '../communications/Message';
import PubSub from '../communications/PubSub';


export default class Player {


  constructor(id) {
    this.id = id;
    this.name = '';

    sessionSet('ttr_username', Date.now());

    this.reset();
    this.getNameFromStorage();
  }


  simplify() {
    return {
      id: this.id,
      name: this.name,
    };
  }


  reset() {
    this.color = '';
    this.pieces = 0;
    this.active = false;
    this.hand = {};
    this.builtRoutes = [];
  }


  getNameFromStorage() {
    const name = sessionGet('ttr_username');
    if (name) {
      this.changeName(name, false);
    }
  }


  changeName = (name, message = true) => {
    if (name === '') return;
    IO.emit('Player.changeName', { name, id: this.id })
      .then(() => {
        this.name = name;
        sessionSet('ttr_username', name);
        if (message) {
          Message.success('Username changed!');
        }
        console.log(this.simplify());
      })
      .catch(response => {
        this.name = '';
        sessionRemove('ttr_username');
        Message.error(response.message);
      });
    PubSub.pub('Player.changeName', this.simplify());
  }


  startGame(color) {
    this.color = color;
  }


  endGame() {
    this.reset();
  }

}
