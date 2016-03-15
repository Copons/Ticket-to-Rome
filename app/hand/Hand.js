import { rules } from '../constants/rules';

export default class Hand {

  constructor (deck) {
    this.cards = [];
    let i = 0;
    for (; i < rules.startingHand; i++) {
      this.cards.push(deck.draw());
    }
    console.log(this.cards);
  }

  draw (card) {
    this.cards = this.cards.concat(card);
  }

  discard (discardedCard) {
    this.cards = this.cards.filter(card => card.id !== discardedCard.id);
  }

}
