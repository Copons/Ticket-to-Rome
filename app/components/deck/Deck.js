import './deck.css';
import { qs, addClass, removeClass } from '../../libs/dom';
//import IO from '../communications/IO';
//import Message from '../communications/Message';
//import PubSub from '../communications/PubSub';


export default class Deck {


  constructor(cardsCount) {
    this.counter = cardsCount;

    this.el = { deck: document.getElementById('deck') };
    this.el.counter = qs('span', this.el.deck);
    this.el.counter.textContent = this.counter;
  }


  update = cardsCount => {
    this.counter = cardsCount;
    this.el.counter.textContent = this.counter;
    if (this.counter) {
      addClass(this.el.deck, 'empty');
    } else {
      removeClass(this.el.deck, 'empty');
    }
  }

}
