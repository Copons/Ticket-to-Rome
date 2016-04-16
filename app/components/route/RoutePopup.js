import Drop from 'tether-drop';
import { RULES } from '../../config';
import { create } from '../../libs/dom';
import { delegate } from '../../libs/events';
import IO from '../communications/IO';
import Message from '../communications/Message';
import PubSub from '../communications/PubSub';
import Game from '../game/Game';
import Player from '../player/Player';

export default class routePopup {


  constructor(route) {
    this.route = route;
    this.el = {
      claims: create('div', { class: 'claims' }),
    };
    this.el.content = this.createContent();
    this.el.popup = this.createPopup();

    this.listen();
  }


  listen() {
    PubSub.sub('Hand.changed', this.renderUpdateClaims);
    delegate('.claim', this.el.claims, 'click', this.claim);
  }


  createPopup() {
    return new Drop({
      target: this.route.el.path,
      classes: 'route-popup',
      content: this.el.content,
      position: 'bottom center',
      openOn: 'click',
      tetherOptions: { offset: '-10px 0' },
    });
  }


  createContent() {
    const content = create('div');

    content.insertAdjacentHTML('beforeend',
      `<div class="title">
        <span class="start">${this.route.stations.start.name}</span>
        <span class="end">${this.route.stations.end.name}</span>
      </div>`
    );

    const parts = [];
    for (let i = 0; i < this.route.parts; i++) {
      parts.push(this.route.type);
    }
    content.insertAdjacentHTML('beforeend', this.createParts(parts));

    content.appendChild(this.el.claims);
    return content;
  }


  createParts(types) {
    let parts = '';
    for (const type of types) {
      parts += `<span class="part ${type}"></span>`;
    }
    return parts;
  }


  renderUpdateClaims = cardGroups => {
    while (this.el.claims.hasChildNodes()) {
      this.el.claims.removeChild(this.el.claims.lastChild);
    }

    const colorCards = cardGroups.filter(group => group.type !== 'wild' && group.cards.length);
    const wildCards = cardGroups.find(group => group.type === 'wild');
    const claims = [];
    let claim = [];

    for (const group of colorCards) {
      claim = [];
      if (group.type === this.route.type || this.route.type === 'wild') {
        if (group.cards.length >= this.route.parts) {
          for (let i = 0; i < this.route.parts; i++) {
            claim.push(group.type);
          }
          claims.push(this.createClaim(claim));
        } else if (group.cards.length + wildCards.cards.length >= this.route.parts) {
          for (let i = 0; i < group.cards.length; i++) {
            claim.push(group.type);
          }
          for (let i = 0; i < this.route.parts - group.cards.length; i++) {
            claim.push('wild');
          }
          claims.push(this.createClaim(claim));
        }
      }
    }

    if (wildCards.cards.length >= this.route.parts) {
      claim = [];
      for (let i = 0; i < this.route.parts; i++) {
        claim.push('wild');
      }
      claims.push(this.createClaim(claim));
    }

    if (claims.length) {
      this.el.claims.insertAdjacentHTML('afterbegin',
        '<div class="title">Claim with:</div>'
      );
    } else {
      this.el.claims.insertAdjacentHTML('afterbegin',
        '<div class="title">Unclaimable</div>'
      );
    }

    for (const claimElement of claims) {
      this.el.claims.appendChild(claimElement);
    }
  }


  createClaim(claim) {
    const claimElement = create('div',{
      class: 'claim',
      'data-claim': claim.join(),
    });
    claimElement.insertAdjacentHTML('beforeend', this.createParts(claim));
    return claimElement;
  }


  claim = e => {
    if (Player.active
      && Player.actionsLeft >= RULES.action.claimRoute
    ) {
      const cards = e.target.dataset.claim.split(',');
      IO.emit('Route.claim', {
        cards: cards.length,
        route: this.route.simplify(),
        game: Game.simplify(),
      })
        .then(response => {
          Player.claimRoute(this.route, cards);
          Message.success(response.message);
        })
        .catch(() => {
          Message.error('You don\'t have enough cards to claim this route.');
        });
    }
  }

}
