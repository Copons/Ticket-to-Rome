import './destinationDeck.css';
import { RULES, STATIONS } from '../../config';
import { create, qs, addClass, removeClass, setStyle } from '../../libs/dom';
import { listen } from '../../libs/events';
import IO from '../communications/IO';
import Message from '../communications/Message';
import Game from '../game/Game';
import Player from '../player/Player';


export default class DestinationDeck {


  constructor(destinationsCount) {
    this.counter = destinationsCount;

    this.el = { destinationDeck: document.getElementById('destination-deck') };
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
          this.drawAnimation(response.body)
            .then(() => {
              this.update(this.counter - 1);
              Player.drawDestination(response.body);
              Message.success(response.message);
            });
        })
        .catch(response => {
          Message.error(response.message);
          Player.setActive(true);
        });
    }
  }

  drawAnimation(destination) {
    const deckPosition = this.el.destinationDeck.getBoundingClientRect();
    const card = create('div', { class: 'card animate destination-deck' });
    card.insertAdjacentHTML('afterbegin', `
      <div>${STATIONS.find(s => s.slug === destination.start).name}</div>
      <div>${STATIONS.find(s => s.slug === destination.end).name}</div>
      <span>${destination.points}</span>
    `);

    document.body.appendChild(card);
    setStyle(card, {
      top: `${deckPosition.top - 18}px`,
      left: `${deckPosition.left + 18}px`,
    });
    addClass(card, 'draw-destination');

    return new Promise(resolve => {
      setTimeout(() => {
        removeClass(card, 'destination');
        setTimeout(() => {
          document.body.removeChild(card);
          resolve();
        }, 800);
      }, 200);
    });
  }

}
