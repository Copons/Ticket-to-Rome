import './cardsGroup.css';
import { create } from '../../libs/dom';


/** Class representing a group of cards of the same type in the player's hand. */
export default class CardsGroup {


  /**
   * Create the cards group.
   * @param {string}  type          The group's cards type.
   * @param {Element} handContainer The group's owner hand element.
   */
  constructor(type, handContainer) {
    this.type = type;
    this.cards = [];
    this.element = this.setupElement();
    this.render(handContainer);
  }


  /**
   * Create the group element.
   * @return {Element}
   */
  setupElement() {
    return create('div', { class: `group ${this.type} empty` });
  }


  /**
   * Render an empty group element into its owner hand.
   */
  render(handContainer) {
    handContainer.appendChild(this.element);
  }


  /**
   * Update the group when the cards count changes.
   */
  renderUpdate() {
    while (this.element.firstChild) {
      this.element.removeChild(this.element.firstChild);
    }
    if (this.cards.length) {
      this.element.classList.remove('empty');
      for (let i = 0; i < this.cards.length; i++) {
        if (i > 0) {
          this.cards[i].element.classList.add('stacked');
        } else {
          this.cards[i].element.classList.remove('stacked');
        }
        this.element.appendChild(this.cards[i].element);
      }
    } else {
      this.element.classList.add('empty');
    }
  }


  /**
   * Add a card to the group.
   * @param  {Card}    card The card to add to the group.
   * @return {boolean}
   */
  addCard(card) {
    if (card.type === this.type) {
      this.cards.push(card);
      this.renderUpdate();
      return true;
    }
    return false;
  }


  /**
   * Remove a card from the group and return it.
   * @return {Card}
   */
  removeCard() {
    const card = this.cards.pop();
    this.renderUpdate();
    return card || {};
  }

}
