import './card.css';
import { create } from '../../libs/dom';


/** Class representing a card. */
export default class Card {


  /**
   * Create a card.
   * @param {Object} card The card from the deck emitted by the server.
   */
  constructor(card) {
    this.id = card.id;
    this.type = card.type;
    this.element = this.setupElement();
  }


  /**
   * Create the card element.
   * @return {Element}
   */
  setupElement() {
    return create('div', {
      id: this.id,
      class: `card ${this.type}`,
    });
  }

}
