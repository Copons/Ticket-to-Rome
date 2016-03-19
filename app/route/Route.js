import './route.css';

import uuid from 'node-uuid';
import { createSvg } from '../utils/dom';
import { STATIONS } from '../constants/railway';
import { SIZES } from '../constants/layout';

export default class Route {

  constructor(route, board) {
    this.stations = {
      start: STATIONS.find(station => station.slug === route.start),
      end: STATIONS.find(station => station.slug === route.end),
    };

    this.boardContainer = board.svg;
    this.element = createSvg('path', {
      id: uuid.v4(),
      class: `route ${route.color}`,
    });
  }

  render() {
    this.boardContainer.appendChild(this.element);
  }

  pathDashArray(lineLength, parts) {
    const stationOffset = SIZES.stationRadius;
    const pathLength = lineLength - stationOffset * 2 - (parts - 1) * SIZES.routeGap;

    const dashes = [0, stationOffset];
    for (let i = 0; i < parts; i++) {
      dashes.push(pathLength / parts);
      if (i !== parts - 1) {
        dashes.push(SIZES.routeGap);
      }
    }
    dashes.push(stationOffset);

    return dashes.join(', ');
  }

  setPathAttributes(parts) {
    this.element.setAttributeNS(null, 'd', this.pathD());
    this.element.setAttributeNS(null,
      'stroke-dasharray', this.pathDashArray(this.pathLength(), parts));
  }

}
