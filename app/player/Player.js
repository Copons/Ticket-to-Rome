import uuid from 'node-uuid';
import Hand from '../hand/Hand';

export default class Player {

  constructor (name, deck) {
    this.id = uuid.v4();
    this.name = name;
    this.hand = new Hand(deck);
  }

  drawFromDeck (deck) {
    this.hand.draw(deck.draw());
  }

}
