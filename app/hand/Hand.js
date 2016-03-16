import './hand.css';

import { create } from '../utils/dom';
import { RULES } from '../constants/rules';

export default class Hand {

  constructor(deck, playerId) {
    this.cards = [];
    for (let i = 0; i < RULES.startingHand; i++) {
      this.cards.push(deck.draw());
    }

    this.element = create('div', 'hand', { id : `player-${playerId}` });
    this.playerContainer = document.getElementById(playerId);
    this.render();
  }

  render() {
    for (const card of this.cards) {
      this.element.appendChild(card.element);
    }
    this.playerContainer.appendChild(this.element);
  }

  renderUpdate() {
    while (this.element.firstChild) {
      this.element.removeChild(this.element.firstChild);
    }
    this.cards.sort((a, b) => a.type.localeCompare(b.type));
    for (const card of this.cards) {
      if (card) {
        this.element.appendChild(card.element);
      }
    }
  }

  addCard(card) {
    this.cards = this.cards.concat(card);
    this.renderUpdate();
  }

  discard(card) {
    this.cards = this.cards.filter(filterCard => filterCard.id !== card.id);
  }

}
