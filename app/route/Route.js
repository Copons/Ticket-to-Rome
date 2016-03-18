import './route.css';

import uuid from 'node-uuid';
import { create, setStyle, correctPosition } from '../utils/dom';
import { SIZES } from '../constants/layout';
import { STATIONS, ROUTES } from '../constants/railway';

export default class Route {

  constructor(start, end, board) {
    const routeInfo = ROUTES.find(route => route.start === start && route.end === end);
    const stationStart = STATIONS.find(station => station.slug === start);
    const stationEnd = STATIONS.find(station => station.slug === end);

    this.size = routeInfo.size;
    this.coordinates = {
      x1: stationStart.x,
      y1: stationStart.y,
      x2: stationEnd.x,
      y2: stationEnd.y,
    };

    this.boardContainer = board.element;
    this.elements = {
      route: create('div', 'route', {
        id: uuid.v4(),
      }),
      parts: create('div', 'parts'),
    };

    setStyle(this.elements.route, {
      top: correctPosition(this.coordinates.y1, SIZES.stationRadius),
      left: correctPosition(this.coordinates.x1, SIZES.stationRadius),
      width: `${this.getRectWidth()}%`,
      height: `${this.getRectHeight()}%`,
    });
    this.elements.route.classList.add(routeInfo.color);

    const rectDiagonal = this.getRectDiagonal();
    setStyle(this.elements.parts, {
      width: `${rectDiagonal.width}px`,
      transformOrigin: '0',
      transform: `rotate(${rectDiagonal.angle}deg)`,
    });

    this.render();
  }

  render() {
    this.elements.route.appendChild(this.elements.parts);
    this.boardContainer.appendChild(this.elements.route);

    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      const resizeTimer = setTimeout(() => {
        const rectDiagonal = this.getRectDiagonal();
        setStyle(this.elements.parts, {
          width: `${rectDiagonal.width}px`,
          transform: `rotate(${rectDiagonal.angle}deg)`,
        });
      }, 250);
    });
  }

  getRectWidth() {
    return Math.abs(this.coordinates.x1 - this.coordinates.x2);
  }

  getRectHeight() {
    return Math.abs(this.coordinates.y1 - this.coordinates.y2);
  }

  getRectDiagonal() {
    const rectWidth = window.innerWidth / 100 * this.getRectWidth();
    const rectHeight = window.innerHeight / 100 * this.getRectHeight();
    const diagonalWidth = Math.sqrt(Math.pow(rectWidth, 2) + Math.pow(rectHeight, 2));
    console.log(rectWidth);
    console.log(rectHeight);
    const diagonalAngle = rectHeight / rectWidth * (180 / Math.PI);
    console.log(diagonalAngle);
    return {
      width: diagonalWidth,
      angle: diagonalAngle,
    };
  }

}
