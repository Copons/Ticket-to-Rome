import './board.css';

import { create, createSvg } from '../utils/dom';
import { APP_CONTAINER, SIZES } from '../constants/layout';
import { STATIONS, ROUTES } from '../constants/railway';
import Station from '../station/Station';
import Route from '../route/Route';

export default class Board {

  constructor() {
    this.element = create('div', { class: 'board' });
    this.svg = createSvg('svg', {
      viewBox: `0 0 ${SIZES.boardWidth} ${SIZES.boardHeight}`,
    });

    this.railway = {
      routes: ROUTES.map(route => new Route(route.start, route.end, this)),
      stations: STATIONS.map(station => new Station(station.slug, this)),
    };

    this.render();
  }

  render() {
    this.element.appendChild(this.svg);
    APP_CONTAINER.appendChild(this.element);
  }

}
