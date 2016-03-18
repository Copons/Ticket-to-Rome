import './card.css';

import uuid from 'node-uuid';
import { create } from '../utils/dom';

export default class Card {

  constructor(type) {
    this.id = uuid.v4();
    this.type = type;

    this.element = create('div', 'card', { id : this.id });
    this.element.classList.add(this.type);
  }

}
