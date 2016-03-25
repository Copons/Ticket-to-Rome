import Drop from 'tether-drop';
import PubSub from '../../libs/PubSub';
import { create } from '../../libs/dom';
import { listen } from '../../libs/events';


/** Class representing a route popup. */
export default class RoutePopup {


  /**
   * Create the route popup.
   * @param {Route} route The related route.
   */
  constructor(route) {
    this.route = route;
    this.dropContent = this.setupDropContent();
    this.element = this.setupElement();
    PubSub.sub('hand/changed', this.updateRouteClaims);
  }


  /**
   * Setup the popup content.
   * @return {Object}
   */
  setupDropContent() {
    const dropContent = {
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

    dropContent.title.start.textContent = this.route.stations.start.name;
    dropContent.title.end.textContent = this.route.stations.end.name;
    dropContent.title.container.appendChild(dropContent.title.start);
    dropContent.title.container.appendChild(dropContent.title.end);

    const parts = [];
    for (let i = 0; i < this.route.parts; i++) {
      parts.push(this.route.type);
    }
    dropContent.info.parts.insertAdjacentHTML(
      'beforeend', this.createParts(parts)
    );
    dropContent.info.container.appendChild(dropContent.info.parts);

    dropContent.content.appendChild(dropContent.title.container);
    dropContent.content.appendChild(dropContent.info.container);
    dropContent.content.appendChild(dropContent.claims);
    return dropContent;
  }


  setupElement() {
    return new Drop({
      target: this.route.element.path,
      classes: 'route-popup',
      content: this.dropContent.content,
      position: 'bottom center',
      openOn: 'click',
      tetherOptions: { offset: '-10px 0' },
    });
  }


  /**
   * Create the part elements;
   * @param  {Array}  types The parts types.
   * @return {string}
   */
  createParts(types) {
    let parts = '';
    for (const type of types) {
      parts += `<span class="part ${type}"></span>`;
    }
    return parts;
  }


  updateRouteClaims = data => {
    while (this.dropContent.claims.hasChildNodes()) {
      this.dropContent.claims.removeChild(this.dropContent.claims.lastChild);
    }

    const colorCards = data.hand.filter(group => group.type !== 'wild' && group.cards.length);
    const wildCards = data.hand.find(group => group.type === 'wild');
    const claimContent = [];
    let claim = [];

    for (const group of colorCards) {
      claim = [];
      if (group.type === this.route.type || this.route.type === 'wild') {
        if (group.cards.length >= this.route.parts) {
          // type cards are enough to claim the route
          for (let i = 0; i < this.route.parts; i++) {
            claim.push(group.type);
          }
          claimContent.push(this.setupClaimDiv(claim));
        } else if (group.cards.length + wildCards.cards.length >= this.route.parts) {
          // wild cards are in part needed to claim the route
          for (let i = 0; i < group.cards.length; i++) {
            claim.push(group.type);
          }
          for (let i = 0; i < this.route.parts - group.cards.length; i++) {
            claim.push('wild');
          }
          claimContent.push(this.setupClaimDiv(claim));
        }
      }
    }

    if (wildCards.cards.length >= this.route.parts) {
      claim = [];
      for (let i = 0; i < this.route.parts; i++) {
        claim.push('wild');
      }
      claimContent.push(this.setupClaimDiv(claim));
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


  setupClaimDiv = claim => {
    const claimDiv = create('div', {
      class: 'claim',
      'data-claim': claim.join(),
    });
    claimDiv.innerHTML = this.createParts(claim);
    return claimDiv;
  }



  /**
   * Dispatch a claim route event whenever the claim container is clicked.
   * @param  {Event} e - The click event.
   */
  claimRoute = e => {
    PubSub.pub('game/action', {
      action: 'route/claim',
      route: this.route,
      cards: e.target.dataset.claim.split(','),
    });
  }

}
