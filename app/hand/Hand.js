import './hand.css';

import { create } from '../utils/dom';
import { listen, customEvent } from '../utils/events';
import { RULES } from '../constants/rules';
import { DECK_COMPOSITION } from '../constants/deckComposition';

export default class Hand {

  constructor(deck, playerId) {
    this.groups = DECK_COMPOSITION.map(item => ({
      type : item.type,
      cards : [],
      element : create('div', {
        class: 'group',
        'data-type': item.type,
      }),
    }));
    for (let i = 0; i < RULES.startingHand; i++) {
      this.addCard(deck.draw(), false);
    }

    this.removeCardsToClaimRoute = this.removeCardsToClaimRoute.bind(this);

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

    listen(window, 'routeClaimed', this.removeCardsToClaimRoute);
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
      }
    }
  }

  addCard(card, update = true) {
    this.groups.find(group => group.type === card.type).cards.push(card);
    customEvent(window, 'handChanged', this.simplifyGroups());
    if (update) {
      this.renderUpdate();
    }
  }

  removeCardsToClaimRoute(e) {
    for (const type of e.detail.cards) {
      this.groups.find(group => group.type === type).cards.pop();
    }
    customEvent(window, 'handChanged', this.simplifyGroups());
    this.renderUpdate();
  }

  simplifyGroups() {
    const groups = {};
    for (const group of this.groups) {
      if (group.cards.length > 0) {
        groups[group.type] = group.cards.length;
      }
    }
    return JSON.stringify(groups);
  }

}
