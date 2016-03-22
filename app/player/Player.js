import './player.css';

import uuid from 'node-uuid';
import { create } from '../utils/dom';
import { listen } from '../utils/events';
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
    this.builtRoutes = [];

    this.claimRoute = this.claimRoute.bind(this);

    this.element = create('div', {
      id: this.id,
      class: 'player',
    });
    this.render(deck);

    this.hand = new Hand(deck, this);
  }


  /**
   * Append the player element to the app container.
   */
  render() {
    this.element.insertAdjacentHTML('afterbegin', `<div class="player-name">${this.name}</div>`);
    APP_CONTAINER.appendChild(this.element);

    listen(window, 'routeClaimed', this.claimRoute);
  }


  /**
   * Draw a card from the deck.
   * @param  {Deck} deck - The deck.
   */
  drawFromDeck(deck) {
    this.hand.addCard(deck.draw());
  }


  /**
   * Claim and build a route.
   * @param  {Event} e - The route claiming event.
   */
  claimRoute(e) {
    if (!e) return;

    this.builtRoutes.push({
      start: e.detail.start,
      end: e.detail.end,
    });
    console.log(
      `Player ${this.name} claimed route ${e.detail.start.name} - ${e.detail.end.name}`
    );
  }

}
