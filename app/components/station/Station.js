import './station.css';
import { SIZES } from '../../config';
import { createSvg } from '../../libs/dom';


export default class Station {

  constructor(station) {
    this.slug = station.slug;
    this.name = station.name;
    this.x = station.x;
    this.y = station.y;

    this.el = this.create();
  }


  create() {
    const nameCoordinates = this.adjustNamePosition();
    const element = {
      station: createSvg('circle', {
        class: 'station',
        'data-station': this.slug,
        cx: this.x,
        cy: this.y,
      }),
      name: createSvg('text', {
        class: 'name',
        'data-station': this.slug,
        x: nameCoordinates.x,
        y: nameCoordinates.y,
        transform: `rotate(-30, ${nameCoordinates.x}, ${nameCoordinates.y})`,
      }),
    };
    element.name.textContent = this.name;
    return element;
  }


  adjustNamePosition() {
    return {
      x: this.x + SIZES.station.radius + SIZES.station.name - SIZES.station.stroke,
      y: this.y + SIZES.station.radius - SIZES.station.name,
    };
  }

}
