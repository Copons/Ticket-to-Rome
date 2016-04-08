import './deck.css';
import { qs, addClass, removeClass } from '../../libs/dom';
import { listen } from '../../libs/events';
import IO from '../communications/IO';
import Message from '../communications/Message';
import Card from '../card/Card';
import Game from '../game/Game';
import Player from '../player/Player';


export default class Deck {


  constructor(cardsCount) {
    this.counter = cardsCount;

    this.el = { deck: document.getElementById('deck') };
    this.el.counter = qs('span', this.el.deck);
    this.el.counter.textContent = this.counter;

    this.listen();
  }


  listen() {
    listen(this.el.deck, 'click', this.draw);
  }


  update(cardsCount) {
    this.counter = cardsCount;
    this.el.counter.textContent = this.counter;
    if (this.counter) {
      removeClass(this.el.deck, 'empty');
    } else {
      addClass(this.el.deck, 'empty');
    }
  }


  draw() {
    if (Player.active && this.counter > 1) {
      Player.setActive(false);
      IO.emit('Deck.draw', { id: Game.room.id })
        .then(response => {
          this.update(this.counter - 1);
          Player.hand.addCard(new Card(response.body));
          Message.success(response.message);
          Player.setActive(true);
        })
        .catch(response => {
          Message.error(response.error);
          Player.setActive(true);
        });
    }
  }

}
