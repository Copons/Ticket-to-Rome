import './destinations.css';
import uuid from 'node-uuid';
import { STATIONS } from '../../config';
import { create, qs, addClass } from '../../libs/dom';


export default class Destinations {

  constructor(destinations) {
    this.list = [];
    this.el = { destinations: document.getElementById('destinations') };
    this.init(destinations);
  }


  init(destinations) {
    for (const destination of destinations) {
      this.add(destination);
    }
  }


  add(destination) {
    let name = STATIONS.find(s => s.slug === destination.start).name;
    name += ' - ';
    name += STATIONS.find(s => s.slug === destination.end).name;
    const actualDestination = {
      name,
      id: uuid.v4(),
      start: destination.start,
      end: destination.end,
      points: destination.points,
      completed: false,
    };

    this.list.push(actualDestination);

    const destinationElement = create('div', {
      class: 'destination',
      'data-destination': actualDestination.id,
    });
    destinationElement.insertAdjacentHTML('afterbegin', `
      ${actualDestination.name}
      <span class="points">
        ${actualDestination.points}
        <span class="icon"></span>
      </span>
    `);
    this.el.destinations.appendChild(destinationElement);
  }


  update(graphs) {
    for (const destination of this.list) {
      for (const graph of graphs) {
        if (graph.indexOf(destination.start) > -1 && graph.indexOf(destination.end) > -1) {
          destination.completed = true;
          addClass(qs(`[data-destination="${destination.id}"]`), 'completed');
        }
      }
    }
  }

}
