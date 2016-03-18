import './board.css';

import { create } from '../utils/dom';
import { APP_CONTAINER } from '../constants/layout';
import { STATIONS, ROUTES } from '../constants/railway';
import Station from '../station/Station';
import Route from '../route/Route';

export default class Board {

  constructor() {
    this.element = create('div', 'board');
    this.railway = {
      stations: STATIONS.map(station => new Station(station.slug, this)),
      routes: ROUTES.map(route => new Route(route.start, route.end, this)),
    };

    this.render();
  }

  render() {
    APP_CONTAINER.appendChild(this.element);
  }

}
