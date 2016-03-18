import './station.css';

import uuid from 'node-uuid';
import { create, setStyle } from '../utils/dom';
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

    this.boardContainer = board.element;
    this.element = create('div', 'station', {
      id: uuid.v4(),
      'data-station': `${this.slug}`,
    });
    setStyle(this.element, {
      top: `${station.y}%`,
      left: `${station.x}%`,
    });
    this.render();
  }

  render() {
    this.boardContainer.appendChild(this.element);
  }

}
