import './station.css';
import uuid from 'node-uuid';
import { SIZES } from '../../config';
import { createSvg } from '../../libs/dom';


/** Class representing a station. */
export default class Station {


  /**
   * Create a station.
   * @param {Object} station The station information.
   */
  constructor(station) {
    this.id = uuid.v4();
    this.slug = station.slug;
    this.name = station.name;
    this.x = station.x;
    this.y = station.y;
    this.element = this.setupElement();
  }


  /**
   * Create the station element.
   * @return {Element}
   */
  setupElement() {
    const nameCoordinates = this.adjustNamePosition();
    const element = {
      station: createSvg('circle', {
        id: this.id,
        class: 'station',
        'data-station': this.slug,
        cx: this.x,
        cy: this.y,
      }),
      name: createSvg('text', {
        'data-station': this.slug,
        x: nameCoordinates.x,
        y: nameCoordinates.y,
        transform: `rotate(-30, ${nameCoordinates.x}, ${nameCoordinates.y})`,
      }),
    };
    element.name.textContent = this.name;
    return element;
  }


  /**
   * Correct the station name coordinates.
   */
  adjustNamePosition() {
    return {
      x: this.x + SIZES.station.radius + SIZES.station.name - SIZES.station.stroke,
      y: this.y + SIZES.station.radius - SIZES.station.name,
    };
  }

}
