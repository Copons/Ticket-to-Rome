import './deck.css';
import { APP_CONTAINER, DECK } from '../../constants';
import { create } from '../../libs/dom';
import { listen } from '../../libs/events';
import { random } from '../../libs/math';
import PubSub from '../../libs/PubSub';
import Card from '../card';


/** Class representing the deck. */
export default class Deck {


  /**
   * Create the deck.
   */
  constructor() {
    this.setupCards();
    this.render();
  }


  /**
   * Create the deck element and append it to the app container.
   */
  render() {
    this.element = create('div', { class: 'deck' });
    this.deckCounter = create('div', { class: 'deck-counter' });
    this.deckCounter.textContent = this.cards.length;
    this.element.appendChild(this.deckCounter);
    APP_CONTAINER.appendChild(this.element);
    listen(this.element, 'click', this.draw);
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
   * Setup the deck cards.
   */
  setupCards() {
    this.cards = [];
    for (const card of DECK) {
      for (let i = 0; i < card.amount; i++) {
        this.cards.push(new Card(card.type));
      }
    }
  }


  /**
   * Draw a card from the deck.
   */
  draw = () => {
    const drawnCard = this.cards[random(this.cards.length)];
    this.cards = this.cards.filter(card => card.id !== drawnCard.id);
    this.renderUpdate();
    PubSub.pub('game/action', {
      action: 'deck/draw',
      card: drawnCard,
    });
    return drawnCard;
  }

}
