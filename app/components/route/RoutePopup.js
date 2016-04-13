import Drop from 'tether-drop';
import { create } from '../../libs/dom';


export default class routePopup {


  constructor(route) {
    this.route = route;
    this.el = {
      claims: create('div', { class: 'claims' }),
    };
    this.el.content = this.createContent();
    this.el.popup = this.createPopup();
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

}
