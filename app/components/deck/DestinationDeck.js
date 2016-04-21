import './destinationDeck.css';
import { RULES } from '../../config';
import { qs, addClass, removeClass } from '../../libs/dom';
import { listen } from '../../libs/events';
import IO from '../communications/IO';
import Message from '../communications/Message';
import Game from '../game/Game';
import Player from '../player/Player';


export default class DestinationDeck {


  constructor(destinationsCount) {
    this.counter = destinationsCount;

    this.el = { destinationDeck: document.getElementById('destinationDeck') };
    this.el.counter = qs('span', this.el.destinationDeck);
    this.el.counter.textContent = this.counter;

    this.listen();
  }


  listen() {
    IO.io.on('DestinationDeck.count', this.update);
    listen(this.el.destinationDeck, 'click', this.draw);
  }


  update = cardsCount => {
    this.counter = cardsCount;
    this.el.counter.textContent = this.counter;
    if (this.counter) {
      removeClass(this.el.destinationDeck, 'empty');
    } else {
      addClass(this.el.destinationDeck, 'empty');
    }
  }


  draw = () => {
    if (Player.active
      && Player.actionsLeft >= RULES.action.newDestination
      && this.counter > 0
    ) {
      Player.setActive(false);
      IO.emit('DestinationDeck.draw', Game.simplify())
        .then(response => {
          this.update(this.counter - 1);
          Player.drawDestination(response.body);
          Message.success(response.message);
        })
        .catch(response => {
          Message.error(response.message);
          Player.setActive(true);
        });
    }
  }

}
