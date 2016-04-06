import './deck.css';
import { qs, addClass, removeClass } from '../../libs/dom';
import { listen } from '../../libs/events';
//import IO from '../communications/IO';
//import Message from '../communications/Message';
//import PubSub from '../communications/PubSub';


export default class Deck {


  constructor(cardsCount) {
    this.counter = cardsCount;

    this.el = { deck: document.getElementById('deck') };
    this.el.counter = qs('span', this.el.deck);
    this.el.counter.textContent = this.counter;

    listen(this.el.deck, 'click', this.draw);
  }


  update = cardsCount => {
    this.counter = cardsCount;
    this.el.counter.textContent = this.counter;
    if (this.counter) {
      removeClass(this.el.deck, 'empty');
    } else {
      addClass(this.el.deck, 'empty');
    }
  }


  draw = () => {
    if (this.counter > 1) {
      this.update(this.counter - 1);
    }
  }

}
