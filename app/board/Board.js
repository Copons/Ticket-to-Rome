import './board.css';

import { create } from '../utils/dom';
import { APP_CONTAINER } from '../constants/layout';
import { STATIONS, ROUTES } from '../constants/railway';
import Station from '../station/Station';

export default class Board {

  constructor() {
    this.element = create('div', 'board');
    this.railway = {
      stations: STATIONS.map(station => new Station(station.slug, this)),
      routes: ROUTES,
    };

    this.render();
  }

  render() {
    APP_CONTAINER.appendChild(this.element);
  }

}
