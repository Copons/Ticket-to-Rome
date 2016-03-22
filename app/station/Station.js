import './station.css';

import uuid from 'node-uuid';
import { createSvg } from '../utils/dom';
import { ROUTES } from '../constants/railway';
import { SIZES } from '../constants/layout';


/** Class representing a station. */
export default class Station {


  /**
   * Create a station.
   * @param  {Object} station - The station information.
   * @param  {Board} board - The game board.
   */
  constructor(station, board) {
    this.slug = station.slug;
    this.name = station.name;

    this.connections = [];
    for (const route of ROUTES) {
      if (this.slug === route.start) {
        this.connections.push(route.end);
      } else if (this.slug === route.end) {
        this.connections.push(route.start);
      }
    }

    this.boardContainer = board.elements;
    this.element = createSvg('circle', {
      id: uuid.v4(),
      class: 'station',
      'data-station': `${this.slug}`,
      cx: station.x,
      cy: station.y,
      stroke: 'red',
      fill: 'green',
    });

    const nameCoordinates = {
      x: station.x + SIZES.stationRadius + SIZES.stationNameSize - 2,
      y: station.y + SIZES.stationRadius - 6,
    };
    this.name = createSvg('text', {
      'data-station': `${this.slug}`,
      x: nameCoordinates.x,
      y: nameCoordinates.y,
      transform: `rotate(-30, ${nameCoordinates.x}, ${nameCoordinates.y})`,
    });
    this.name.textContent = station.name;

    this.render();
  }


  /**
   * Append the station elements to the game board.
   */
  render() {
    this.boardContainer.names.appendChild(this.name);
    this.boardContainer.stations.appendChild(this.element);
  }

}
