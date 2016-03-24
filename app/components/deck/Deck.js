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
    this.cards = this.setupCards();
    this.element = this.setupElement();
    this.render();
  }


  /**
   * Setup the deck cards.
   * @return {Array}
   */
  setupCards() {
    const cards = [];
    for (const card of DECK) {
      for (let i = 0; i < card.amount; i++) {
        cards.push(new Card(card.type));
      }
    }
    return cards;
  }


  /**
   * Create the deck element.
   * @return {Object}
   */
  setupElement() {
    const element = {
      deck: create('div', { class: 'deck' }),
      counter: create('div', { class: 'deck-counter' }),
    };
    element.counter.textContent = this.cards.length;
    return element;
  }


  /**
   * Render the deck into the app container.
   */
  render() {
    this.element.deck.appendChild(this.element.counter);
    APP_CONTAINER.appendChild(this.element.deck);

    listen(this.element.deck, 'click', this.draw);
  }


  /**
   * Update the deck when the cards count changes.
   */
  renderUpdate() {
    this.element.counter.textContent = this.cards.length;
    if (!this.cards.length) {
      this.element.deck.classList.add('empty');
    } else {
      this.element.deck.classList.remove('empty');
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
