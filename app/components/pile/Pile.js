import './pile.css';
import { RULES } from '../../config';
import { addClass, setStyle } from '../../libs/dom';
import { delegate } from '../../libs/events';
import IO from '../communications/IO';
import Message from '../communications/Message';
import Card from '../card/Card';
import Game from '../game/Game';
import Player from '../player/Player';


export default class Pile {

  constructor() {
    this.cards = [];
    this.el = document.getElementById('pile');
    this.listen();
    this.init();
  }


  listen() {
    IO.io.on('Pile.updated', this.update);
    delegate('.card', this.el, 'click', this.draw);
  }



  init() {
    while (this.el.firstChild) {
      this.el.removeChild(this.el.firstChild);
    }
    IO.emit('Pile.deal', { game: Game.simplify() })
      .catch(response => {
        Message.error(response.message);
      });
  }


  update = response => {
    while (this.el.firstChild) {
      this.el.removeChild(this.el.firstChild);
    }
    this.cards = [];
    for (const card of response.body.pile) {
      this.cards.push(new Card(card));
    }
    for (const card of this.cards) {
      this.el.appendChild(card.el);
      addClass(card.el, 'pile');
    }
  }


  draw = e => {
    const actions = e.target.getAttribute('class').includes('wild') ?
      RULES.action.drawWildFromPile : RULES.action.drawFromPile;
    if (Player.active && Player.actionsLeft >= actions) {
      Player.setActive(false);
      const card = this.cards.find(c => c.id === e.target.id);

      const animationCard = card.el.cloneNode();
      const cardPosition = card.el.getBoundingClientRect();
      document.body.appendChild(animationCard);
      addClass(animationCard, 'animate');
      setStyle(animationCard, {
        top: `${cardPosition.top - 18}px`,
        left: `${cardPosition.left + 18}px`,
        opacity: 0,
        position: 'fixed',
      });

      IO.emit('Pile.draw', { card, game: Game.simplify() })
        .then(response => {
          this.drawAnimation(animationCard)
            .then(() => {
              Player.drawCardFromPile(card);
              Message.success(response.message);
            });
        })
        .catch(response => {
          Message.error(response.message);
          Player.setActive(true);
        });
    }
  }


  drawAnimation(card) {
    addClass(card, 'draw-card');

    return new Promise(resolve => {
      setTimeout(() => {
        document.body.removeChild(card);
        resolve();
      }, 1000);
    });
  }

}
