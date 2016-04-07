import { sessionSet, sessionGet, sessionRemove } from '../../libs/storage';
import IO from '../communications/IO';
import Message from '../communications/Message';
import PubSub from '../communications/PubSub';
import Hand from '../hand/Hand';


class Player {


  constructor() {
    this.id = '';
    this.name = '';
  }


  simplify() {
    return {
      id: this.id,
      name: this.name,
    };
  }


  init(id) {
    this.id = id;
    this.reset();
    this.getNameFromStorage();
  }


  initHand() {
    this.hand = new Hand();
  }


  reset() {
    this.color = '';
    this.pieces = 0;
    this.active = false;
    this.hand = [];
    this.builtRoutes = [];
  }


  getNameFromStorage() {
    const name = sessionGet('ttr_username');
    if (name) {
      this.setName(name, false);
    }
  }


  setName = (name, message = true) => {
    if (name === '') return;
    IO.emit('Player.setName', { name, id: this.id })
      .then(() => {
        this.name = name;
        sessionSet('ttr_username', name);
        if (message) {
          Message.success('Username changed!');
        }
        PubSub.pub('Player.setName', this.simplify());
      })
      .catch(response => {
        this.name = '';
        sessionRemove('ttr_username');
        Message.error(response.message);
        PubSub.pub('Player.setName', this.simplify());
      });
  }


  setColor(color) {
    this.color = color;
  }


  setActive(active) {
    this.active = active;
  }

}


export default new Player();
