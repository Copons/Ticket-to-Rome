import './player.css';

import uuid from 'node-uuid';
import { create } from '../utils/dom';
import { APP_CONTAINER } from '../constants/layout';
import { RULES } from '../constants/rules';
import Hand from '../hand/Hand';

export default class Player {

  constructor(name, deck) {
    this.id = uuid.v4();
    this.name = name;
    this.pieces = RULES.startingPieces;
    this.active = false;

    this.element = create('div', 'player', { id : this.id });
    this.render(deck);

    this.hand = new Hand(deck, this.id);
  }

  render() {
    this.element.insertAdjacentHTML('afterbegin', `<div class="player-name">${this.name}</div>`);
    APP_CONTAINER.appendChild(this.element);
  }

  drawFromDeck(deck) {
    this.hand.addCard(deck.draw());
  }

}
