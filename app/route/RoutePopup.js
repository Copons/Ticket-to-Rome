import Drop from 'tether-drop';
import { create } from '../utils/dom';
import { listen, customEvent } from '../utils/events';

export default class RoutePopup {

  constructor(route) {
    this.route = route;

    this.createClaimsContent = this.createClaimsContent.bind(this);
    this.claimRoute = this.claimRoute.bind(this);

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

    const parts = [];
    for (let i = 0; i < this.route.parts; i++) {
      parts.push(this.route.type);
    }
    this.dropContent.info.parts.insertAdjacentHTML(
      'beforeend',
      this.createParts(parts)
    );
    this.dropContent.info.container.appendChild(this.dropContent.info.parts);
    this.dropContent.content.appendChild(this.dropContent.info.container);

    this.dropContent.content.appendChild(this.dropContent.claims);
    this.createClaimsContent();
  }

  createClaimsContent(e) {
    if (!e) {
      return;
    }
    const hand = JSON.parse(e.detail);

    while (this.dropContent.claims.hasChildNodes()) {
      this.dropContent.claims.removeChild(this.dropContent.claims.lastChild);
    }

    const wildCards = hand.wild;
    const routeParts = this.route.parts;
    const routeType = this.route.type;

    let claim = [];
    let claimLine = {};
    const claimContent = [];

    for (const type in hand) {
      claim = [];
      if (type !== 'wild') {
        if (type === routeType || routeType === 'wild') {
          if (hand[type] >= routeParts) {
            for (let i = 0; i < routeParts; i++) {
              claim.push(type);
            }
            claimLine = create('div', {
              class: 'claim',
              'data-claim': claim.join(),
            });
            claimLine.innerHTML = this.createParts(claim);
            claimContent.push(claimLine);
          } else if (hand[type] + wildCards >= routeParts) {
            for (let i = 0; i < hand[type]; i++) {
              claim.push(type);
            }
            for (let i = 0; i < routeParts - hand[type]; i++) {
              claim.push('wild');
            }
            claimLine = create('div', {
              class: 'claim',
              'data-claim': claim.join(),
            });
            claimLine.innerHTML = this.createParts(claim);
            claimContent.push(claimLine);
          }
        }
      }
    }

    if (wildCards >= routeParts) {
      claim = [];
      for (let i = 0; i < routeParts; i++) {
        claim.push('wild');
      }
      claimLine = create('div', {
        class: 'claim',
        'data-claim': claim.join(),
      });
      claimLine.innerHTML = this.createParts(claim);
      claimContent.push(claimLine);
    }

    if (claimContent.length) {
      this.dropContent.claims.innerHTML = '<div class="title">Claim with:</div>';
    } else {
      this.dropContent.claims.innerHTML = '<div class="title">Unclaimable</div>';
    }

    for (const claimAction of claimContent) {
      this.dropContent.claims.appendChild(claimAction);
      listen(claimAction, 'click', this.claimRoute);
    }
  }

  createParts(types) {
    let parts = '';
    for (const type of types) {
      parts += `<span class="part ${type}"></span>`;
    }
    return parts;
  }

  claimRoute(e) {
    customEvent(window, 'routeClaimed', {
      routeId: this.route.id,
      cards: e.target.dataset.claim.split(','),
    });
  }

}
