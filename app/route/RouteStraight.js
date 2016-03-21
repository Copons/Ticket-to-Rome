import Route from './Route';

export default class RouteStraight extends Route {

  constructor(route, board) {
    super(route, board);

    this.setPathAttributes();

    this.render();
  }

  pathD() {
    const d = [
      'M', this.stations.start.x, this.stations.start.y,
      'L', this.stations.end.x, this.stations.end.y,
    ];
    return d.join(' ');
  }

  pathLength() {
    return Math.sqrt(
      Math.pow(this.stations.end.x - this.stations.start.x, 2) +
      Math.pow(this.stations.end.y - this.stations.start.y, 2)
    );
  }

}
