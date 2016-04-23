import './cardsGroup.css';
import { create, addClass, removeClass } from '../../libs/dom';


export default class CardsGroup {


  constructor(type) {
    this.type = type;
    this.cards = [];

    this.el = {
      hand: document.getElementById('hand'),
      group: create('div', { class: `group ${this.type} empty` }),
    };

    this.render();
  }


  render() {
    this.el.hand.appendChild(this.el.group);
  }


  renderUpdate() {
    while (this.el.group.firstChild) {
      this.el.group.removeChild(this.el.group.firstChild);
    }
    if (this.cards.length) {
      removeClass(this.el.group, 'empty');
      for (let i = 0; i < this.cards.length; i++) {
        if (i > 0) {
          addClass(this.cards[i].el, 'stacked');
        } else {
          removeClass(this.cards[i].el, 'stacked');
        }
        this.el.group.appendChild(this.cards[i].el);
      }
    } else {
      addClass(this.el.group, 'empty');
    }
  }


  addCard(card) {
    if (card.type === this.type) {
      this.cards.push(card);
      this.renderUpdate();
      return true;
    }
    return false;
  }


  removeCard() {
    const card = this.cards.pop();
    this.renderUpdate();
    return card || {};
  }

}
