import './destinations.css';
import { STATIONS } from '../../config';
import { create } from '../../libs/dom';


export default class Destinations {

  constructor(destinations) {
    this.list = this.init(destinations);
    this.el = { destinations: document.getElementById('destinations') };
    this.render();
  }


  init(destinations) {
    const list = [];
    for (const destination of destinations) {
      list.push(this.addName(destination));
    }
    return list;
  }


  addName(destination) {
    let name = STATIONS.find(s => s.slug === destination.start).name;
    name += ' - ';
    name += STATIONS.find(s => s.slug === destination.end).name;
    return {
      name,
      start: destination.start,
      end: destination.end,
      points: destination.points,
    };
  }


  render() {
    while (this.el.destinations.firstChild) {
      this.el.destinations.removeChild(this.el.destinations.firstChild);
    }
    for (const destination of this.list) {
      const destinationElement = create('div', { class: 'destination' });
      destinationElement.insertAdjacentHTML('afterbegin', `
        ${destination.name}
        <span class="points">
          ${destination.points}
          <span class="icon"></span>
        </span>
      `);
      this.el.destinations.appendChild(destinationElement);
    }
  }


  add(destination) {
    const namedDestination = this.addName(destination);
    this.list.push(namedDestination);

    const destinationElement = create('div', { class: 'destination' });
    destinationElement.insertAdjacentHTML('afterbegin', `
      ${namedDestination.name}
      <span class="points">
        ${namedDestination.points}
        <span class="icon"></span>
      </span>
    `);
    this.el.destinations.appendChild(destinationElement);
  }

}
