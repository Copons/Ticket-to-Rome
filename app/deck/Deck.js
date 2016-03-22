import './deck.css';

import { create } from '../utils/dom';
import { random } from '../utils/helpers';
import { APP_CONTAINER } from '../constants/layout';
import { DECK_COMPOSITION } from '../constants/deckComposition';
import Card from '../card/Card';


/** Class representing the deck. */
export default class Deck {


  /**
   * Create the deck.
   */
  constructor() {
    this.cards = [];
    for (const card of DECK_COMPOSITION) {
      for (let i = 0; i < card.amount; i++) {
        this.cards.push(new Card(card.type));
      }
    }

    this.draw = this.draw.bind(this);

    this.element = create('div', { class: 'deck' });
    this.deckCounter = create('div', { class: 'deck-counter' });
    this.render();
  }


  /**
   * Append the deck to the app container.
   */
  render() {
    this.deckCounter.textContent = this.cards.length;
    APP_CONTAINER.appendChild(this.element);
    this.element.insertAdjacentHTML('afterbegin', '<b>Deck</b>');
    this.element.appendChild(this.deckCounter);
  }


  /**
   * Update the deck when the cards count changes.
   */
  renderUpdate() {
    this.deckCounter.textContent = this.cards.length;
    if (!this.cards.length) {
      this.element.classList.add('empty');
    } else {
      this.element.classList.remove('empty');
    }
  }


  /**
   * Draw a card from the deck.
   */
  draw() {
    const drawnCard = this.cards[random(this.cards.length)];
    this.cards = this.cards.filter(card => card.id !== drawnCard.id);
    this.renderUpdate();
    return drawnCard;
  }

}
