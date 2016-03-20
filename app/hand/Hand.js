import './hand.css';

import { create } from '../utils/dom';
import { listen } from '../utils/events';
import { sessionSet } from '../utils/storage';
import { RULES } from '../constants/rules';
import { DECK_COMPOSITION } from '../constants/deckComposition';

export default class Hand {

  constructor(deck, playerId) {
    this.groups = DECK_COMPOSITION.map(item => ({
      type : item.type,
      cards : [],
      element : create('div', {
        class: 'group',
        draggable: 'true',
      }),
    }));
    for (let i = 0; i < RULES.startingHand; i++) {
      const card = deck.draw();
      this.groups.find(group => group.type === card.type).cards.push(card);
    }

    this.dragStartGroup = this.dragStartGroup.bind(this);

    this.element = create('div', {
      id: `player-${playerId}`,
      class: 'hand',
    });
    this.playerContainer = document.getElementById(playerId);
    this.render();
  }

  render() {
    this.renderGroupedCards();
    this.playerContainer.appendChild(this.element);
  }

  renderUpdate() {
    while (this.element.firstChild) {
      this.element.removeChild(this.element.firstChild);
    }
    this.renderGroupedCards();
  }

  renderGroupedCards() {
    for (const group of this.groups) {
      if (group.cards.length) {
        for (let i = 0; i < group.cards.length; i++) {
          const card = group.cards[i].element;
          if (i > 0) {
            card.classList.add('stacked');
          } else {
            card.classList.remove('stacked');
          }
          group.element.appendChild(card);
        }
        this.element.appendChild(group.element);
        listen(group.element, 'dragstart', this.dragStartGroup);
      }
    }
  }

  addCard(card) {
    this.groups.find(group => group.type === card.type).cards.push(card);
    this.renderUpdate();
  }

  dragStartGroup() {
    sessionSet('dragStartGroup', this);
  }

}
