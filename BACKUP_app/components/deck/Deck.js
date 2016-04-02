import './deck.css';
import { APP_CONTAINER } from '../../config';
import { create } from '../../libs/dom';
import { listen } from '../../libs/events';
import Message from '../message';
import PubSub from '../../libs/PubSub';
import Card from '../card';


/** Class representing the deck. */
export default class Deck {


  /**
   * Create the deck.
   * @param {Object} deck The current game's deck emitted by the server.
   * @param {Socket} io   The Socket.io server.
   */
  constructor(deck, io) {
    this.io = io;
    this.cards = this.setupCards(deck.cards);
    this.element = this.setupElement();
    this.render();

    this.io.on('Deck/remove', this.remove);
  }


  /**
   * Setup the deck cards.
   * @param  {Object} deck The current game's deck emitted by the server.
   * @return {Array}
   */
  setupCards(deckCards) {
    const cards = [];
    for (const card of deckCards) {
      cards.push(new Card(card));
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
    listen(element.deck, 'click', this.draw);
    return element;
  }


  /**
   * Render the deck into the app container.
   */
  render() {
    this.element.deck.appendChild(this.element.counter);
    APP_CONTAINER.appendChild(this.element.deck);
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
   * @param {Object} room The current game room.
   */
  draw = room => {
    /*const drawnCard = this.cards[cardIndex];
    this.cards = this.cards.filter(card => card.id !== drawnCard.id);
    this.renderUpdate();
    PubSub.pub('game/action', {
      action: 'deck/draw',
      card: drawnCard,
    });
    return drawnCard;*/
    this.io.emit('Deck/draw', room, response => {
      if (response === 'Deck is empty') {
        Message.show({
          type: 'error',
          message: response,
        });
      } else {
        this.cards = this.cards.filter(card => card.id !== response.id);
        this.renderUpdate();
        PubSub.pub('Game/action', {
          action: 'Deck/draw',
          card: response,
        });
      }
    });
  }


  remove = card => {
    this.cards = this.cards.filter(c => c.id !== card.id);
    this.renderUpdate();
  }

}
