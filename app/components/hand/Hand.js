import './hand.css';
import { DECK } from '../../config';
import Card from '../card/Card';
import CardsGroup from './CardsGroup';


export default class Hand {


  constructor() {
    this.init();
    this.groups = DECK.map(g => new CardsGroup(g.type));
  }


  init() {
    const handContainer = document.getElementById('hand');
    while (handContainer.firstChild) {
      handContainer.removeChild(handContainer.firstChild);
    }
  }


  addCard(card) {
    this.groups.find(group => group.type === card.type).addCard(new Card(card));
  }

}
