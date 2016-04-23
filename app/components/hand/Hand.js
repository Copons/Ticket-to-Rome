import './hand.css';
import { DECK } from '../../config';
import PubSub from '../communications/PubSub';
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
    PubSub.pub('Hand.changed', this.groups);
  }


  removeCard(type) {
    return this.groups.find(group => group.type === type).removeCard();
  }

}
