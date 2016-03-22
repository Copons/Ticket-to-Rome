import './hand.css';

import { create } from '../utils/dom';
import { listen, customEvent } from '../utils/events';
import { RULES } from '../constants/rules';
import { DECK_COMPOSITION } from '../constants/deckComposition';


/** Class representing the player's hand. */
export default class Hand {


  /**
   * Create the player's hand.
   * @param  {Deck} deck - The deck.
   * @param  {Player} player - The player owning this hand.
   */
  constructor(deck, player) {
    this.player = player;
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
      id: `player-${player.id}`,
      class: 'hand',
    });
    this.playerContainer = this.player.element;
    this.render();
  }


  /**
   * Append the hand to the player container
   * and listen to events changing the contained cards.
   */
  render() {
    this.renderGroupedCards();
    this.playerContainer.appendChild(this.element);

    listen(window, 'routeClaimed', this.removeCardsToClaimRoute);
  }


  /**
   * Update the hand when the contained cards change.
   */
  renderUpdate() {
    while (this.element.firstChild) {
      this.element.removeChild(this.element.firstChild);
    }
    this.renderGroupedCards();
  }


  /**
   * Append the grouped cards to the player's hand.
   */
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


  /**
   * Add a card to the hand.
   * @param {Card} card - The card to add.
   * @param {boolean} [update=true] - Control if a render update is needed.
   */
  addCard(card, update = true) {
    this.groups.find(group => group.type === card.type).cards.push(card);
    customEvent(window, 'handChanged', this.simplifyGroups());
    if (update) {
      this.renderUpdate();
    }
  }


  /**
   * Remove from the hand all the cards needed to claim a route.
   * @param  {Event} e - The event dispatched when the route is claimed.
   */
  removeCardsToClaimRoute(e) {
    if (!e) return;

    for (const type of e.detail.cards) {
      this.groups.find(group => group.type === type).cards.pop();
    }
    customEvent(window, 'handChanged', this.simplifyGroups());
    this.renderUpdate();
  }


  /**
   * Simplify and stringify the grouped cards.
   */
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
