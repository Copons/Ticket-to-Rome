import './station.css';

import uuid from 'node-uuid';
import { createSvg } from '../utils/dom';
import { STATIONS, ROUTES } from '../constants/railway';

export default class Station {

  constructor(slug, board) {
    const station = STATIONS.find(item => item.slug === slug);
    this.slug = slug;
    this.name = station.name;

    this.connections = [];
    for (const route of ROUTES) {
      if (this.slug === route.start) {
        this.connections.push(route.end);
      } else if (this.slug === route.end) {
        this.connections.push(route.start);
      }
    }

    this.boardContainer = board.svg;
    this.element = createSvg('circle', {
      id: uuid.v4(),
      class: 'station',
      'data-station': `${this.slug}`,
      cx: station.x,
      cy: station.y,
      stroke: 'red',
      fill: 'green',
    });

    this.render();
  }

  render() {
    this.boardContainer.appendChild(this.element);
  }

}
