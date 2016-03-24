import './hand.css';
import { APP_CONTAINER, DECK } from '../../constants';
import { create } from '../../libs/dom';
import CardsGroup from './CardsGroup';

/** Class representing the player's hand. */
export default class Hand {


  /**
   * Create the hand.
   */
  constructor() {
    this.setupElement();
    this.setupGroups();
    this.render();
  }


  /**
   * Create the hand element.
   */
  setupElement() {
    this.element = create('div', { class: 'hand' });
  }


  /**
   * Create the groups of cards of the same type.
   */
  setupGroups() {
    this.groups = DECK.map(group => new CardsGroup(group.type, this.element));
  }


  /**
   * Render the hand into the app container.
   */
  render() {
    APP_CONTAINER.appendChild(this.element);
  }


  /**
   * Add a card to the hand, into the group of the same type.
   */
  addCard(card) {
    this.groups.find(group => group.type === card.type).addCard(card);
  }

}
