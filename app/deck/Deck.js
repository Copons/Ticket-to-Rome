import './deck.css';

import { create } from '../utils/dom';
import { random } from '../utils/helpers';
import { APP_CONTAINER } from '../constants/layout';
import { DECK_COMPOSITION } from '../constants/deckComposition';
import Card from '../card/Card';

export default class Deck {

  constructor() {
    this.cards = [];
    for (const card of DECK_COMPOSITION) {
      for (let i = 0; i < card.amount; i++) {
        this.cards.push(new Card(card.type));
      }
    }

    this.draw = this.draw.bind(this);

    this.element = create('div', 'deck');
    this.deckCounter = create('div', 'deck-counter');
    this.render();
  }

  render() {
    this.deckCounter.textContent = this.cards.length;
    APP_CONTAINER.appendChild(this.element);
    this.element.insertAdjacentHTML('afterbegin', '<b>Deck</b>');
    this.element.appendChild(this.deckCounter);
  }

  renderUpdate() {
    this.deckCounter.textContent = this.cards.length;
    if (!this.cards.length) {
      this.element.classList.add('empty');
    } else {
      this.element.classList.remove('empty');
    }
  }

  draw() {
    const drawnCard = this.cards[random(this.cards.length)];
    this.cards = this.cards.filter(card => card.id !== drawnCard.id);
    this.renderUpdate();
    return drawnCard;
  }

}
