import './deck.css';

import { appContainer, create } from '../utils/dom';
import { listen } from '../utils/events';
import { deckComposition } from '../constants/deckComposition';
import Card from '../card/Card';

export default class Deck {

  constructor () {
    this.element = create('div', 'deck');
    this.deckCounter = create('div', 'deck-counter');

    this.cards = [];
    for (const card of deckComposition) {
      let i = 0;
      for (; i < card.amount; i++) {
        this.cards.push(new Card(card.type));
      }
    }

    this.draw = this.draw.bind(this);
    this.renderUpdate = this.renderUpdate.bind(this);
  }

  render () {
    this.deckCounter.textContent = this.cards.length;
    appContainer.appendChild(this.element);
    this.element.appendChild(this.deckCounter);
    listen(this.element, 'click', this.draw);
    listen(this.element, 'drawCardFromDeck', this.renderUpdate);
  }

  renderUpdate () {
    this.deckCounter.textContent = this.cards.length;
  }

  draw () {
    const drawCardFromDeckEvent = new Event('drawCardFromDeck');
    const random = Math.floor(Math.random() * this.cards.length);
    const drawnCard = this.cards[random];
    this.cards = this.cards.filter(card => card.id !== drawnCard.id);
    this.element.dispatchEvent(drawCardFromDeckEvent);
    return drawnCard;
  }

}
