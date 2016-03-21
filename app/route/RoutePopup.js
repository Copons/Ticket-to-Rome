import Drop from 'tether-drop';
import { create } from '../utils/dom';
import { sessionGet } from '../utils/storage';
import { listen } from '../utils/events';

export default class RoutePopup {

  constructor(route) {
    this.route = route;

    this.createHandContent = this.createHandContent.bind(this);

    this.element = {};
    this.dropContent = {
      content: create('div'),
      title: {
        container: create('div', { class: 'title' }),
        start: create('span', { class: 'start' }),
        end: create('span', { class: 'end' }),
      },
      info: {
        container: create('div', { class: 'info' }),
        parts: create('span', { class: 'parts' }),
      },
      hand: create('div', { class: 'hand' }),
    };
    this.render();
  }

  render() {
    this.createDropContent();

    listen(window, 'handChanged', this.createHandContent);

    this.element = new Drop({
      target: this.route.element,
      classes: 'route-popup',
      content: this.dropContent.content,
      position: 'top center',
      openOn: 'click',
      tetherOptions: {
        offset: '5px 0',
      },
    });
  }

  createDropContent() {
    this.dropContent.title.start.textContent = this.route.stations.start.name;
    this.dropContent.title.end.textContent = this.route.stations.end.name;
    this.dropContent.title.container.appendChild(this.dropContent.title.start);
    this.dropContent.title.container.appendChild(this.dropContent.title.end);
    this.dropContent.content.appendChild(this.dropContent.title.container);

    for (let i = 0; i < this.route.parts; i++) {
      this.dropContent.info.parts.insertAdjacentHTML('beforeend',
        `<span class="part ${this.route.type}">x</span>`
      );
    }
    this.dropContent.info.container.appendChild(this.dropContent.info.parts);
    this.dropContent.content.appendChild(this.dropContent.info.container);

    this.createHandContent();
    this.dropContent.content.appendChild(this.dropContent.hand);
  }

  createHandContent() {
    const hand = JSON.parse(sessionGet('hand'));
    let handContent = '';

    for (const type in hand) {
      if (type === 'jolly') {
        if (hand.jolly >= this.route.parts) {
          handContent += `Claimable by ${this.route.parts} jolly.<br />`;
        } else if (
          this.route.type !== 'jolly' &&
          hand[this.route.type] &&
          hand[this.route.type] >= this.route.parts - hand.jolly
        ) {
          handContent += `Claimable by ${this.route.parts - hand.jolly} ${this.route.type} +
          ${hand.jolly} jolly.<br />`;
        }
      }
    }

    this.dropContent.hand.textContent = handContent;
  }

}
