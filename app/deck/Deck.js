import './deck.css';

import { create } from '../utils/dom';
import { APP_CONTAINER } from '../constants/layout';
import { deckComposition } from '../constants/deckComposition';
import Card from '../card/Card';

export default class Deck {

  constructor() {
    this.cards = [];
    for (const card of deckComposition) {
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
    this.element.appendChild(this.deckCounter);
  }

  renderUpdate() {
    this.deckCounter.textContent = this.cards.length;
  }

  draw() {
    const drawnCard = this.cards[Math.floor(Math.random() * this.cards.length)];
    this.cards = this.cards.filter(card => card.id !== drawnCard.id);
    this.renderUpdate();
    return drawnCard;
  }

}
