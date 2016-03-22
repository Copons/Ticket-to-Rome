import './player.css';

import uuid from 'node-uuid';
import { create } from '../utils/dom';
import { APP_CONTAINER } from '../constants/layout';
import { RULES } from '../constants/rules';
import Hand from '../hand/Hand';


/** Class representing a player. */
export default class Player {


  /**
   * Create the player.
   * @param  {string} name - The player's name.
   * @param  {Deck} deck - The deck.
   */
  constructor(name, deck) {
    this.id = uuid.v4();
    this.name = name;
    this.pieces = RULES.startingPieces;
    this.active = false;

    this.element = create('div', {
      id: this.id,
      class: 'player',
    });
    this.render(deck);

    this.hand = new Hand(deck, this.id);
  }


  /**
   * Append the player element to the app container.
   */
  render() {
    this.element.insertAdjacentHTML('afterbegin', `<div class="player-name">${this.name}</div>`);
    APP_CONTAINER.appendChild(this.element);
  }


  /**
   * Draw a card from the deck.
   * @param  {Deck} deck - The deck.
   */
  drawFromDeck(deck) {
    this.hand.addCard(deck.draw());
  }

}
