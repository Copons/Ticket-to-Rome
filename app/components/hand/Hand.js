import './hand.css';
import { DECK } from '../../config';
import CardsGroup from './CardsGroup';


export default class Hand {


  constructor() {
    this.groups = DECK.map(g => new CardsGroup(g.type));
  }

  addCard(card) {
    this.groups.find(group => group.type === card.type).addCard(card);
  }

}
