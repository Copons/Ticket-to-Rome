import './card.css';
import { create } from '../../libs/dom';


export default class Card {


  constructor(card) {
    this.id = card.id;
    this.type = card.type;

    this.el = create('div', {
      id: this.id,
      class: `card ${this.type}`,
    });

    // DEBUG
    this.el.textContent = this.id;
  }


  simplify() {
    return {
      id: this.id,
      type: this.type,
    };
  }

}
