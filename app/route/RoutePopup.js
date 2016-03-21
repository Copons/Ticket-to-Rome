import Drop from 'tether-drop';
import { create } from '../utils/dom';
import { sessionGet } from '../utils/storage';
import { listen } from '../utils/events';

export default class RoutePopup {

  constructor(route) {
    this.route = route;

    this.createClaimsContent = this.createClaimsContent.bind(this);

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
      claims: create('div', { class: 'claims' }),
    };
    this.render();
  }

  render() {
    this.createDropContent();

    listen(window, 'handChanged', this.createClaimsContent);

    this.element = new Drop({
      target: this.route.element,
      classes: 'route-popup',
      content: this.dropContent.content,
      position: 'bottom center',
      openOn: 'click',
      tetherOptions: {
        offset: '-10px 0',
      },
    });
  }

  createDropContent() {
    this.dropContent.title.start.textContent = this.route.stations.start.name;
    this.dropContent.title.end.textContent = this.route.stations.end.name;
    this.dropContent.title.container.appendChild(this.dropContent.title.start);
    this.dropContent.title.container.appendChild(this.dropContent.title.end);
    this.dropContent.content.appendChild(this.dropContent.title.container);

    this.dropContent.info.parts.insertAdjacentHTML(
      'beforeend',
      this.createParts(this.route.type, this.route.parts)
    );
    this.dropContent.info.container.appendChild(this.dropContent.info.parts);
    this.dropContent.content.appendChild(this.dropContent.info.container);

    this.dropContent.content.appendChild(this.dropContent.claims);
    this.createClaimsContent();
  }

  createClaimsContent() {
    const hand = JSON.parse(sessionGet('hand'));
    if (!hand) {
      return;
    }
    const wildCards = hand.wild;
    const routeParts = this.route.parts;
    const routeType = this.route.type;

    let claimContent = '';

    for (const type in hand) {
      if (type !== 'wild') {
        if (type === routeType || routeType === 'wild') {
          if (hand[type] >= routeParts) {
            claimContent += `<div>${this.createParts(type, routeParts)}</div>`;
          } else if (hand[type] + wildCards >= routeParts) {
            claimContent += '<div>';
            claimContent += this.createParts(type, hand[type]);
            claimContent += this.createParts('wild', routeParts - hand[type]);
            claimContent += '</div>';
          }
        }
      }
    }

    if (wildCards >= routeParts) {
      claimContent += `<div>${this.createParts('wild', routeParts)}</div>`;
    }

    if (claimContent !== '') {
      claimContent = `<div class="title">Claim with:</div>${claimContent}`;
    } else {
      claimContent = '<div class="title">Unclaimable</div>';
    }

    this.dropContent.claims.innerHTML = claimContent;
  }


  createParts(type, times = 1) {
    let parts = `<span class="part ${type}"></span>`;
    for (let i = 1; i < times; i++) {
      parts += `<span class="part ${type}"></span>`;
    }
    return parts;
  }

}
