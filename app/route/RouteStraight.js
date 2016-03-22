import Route from './Route';


/**
 * Class representing a straight route.
 * @extends Route
 */
export default class RouteStraight extends Route {


  /**
   * Create the straight route.
   * @param  {Object} route - The route information.
   * @param  {Board} board - The game board.
   */
  constructor(route, board) {
    super(route, board);

    this.setPathAttributes();

    this.render();
  }


  /**
   * Calculate the route's path description attribute.
   * @return {string} The path description.
   */
  pathD() {
    const d = [
      'M', this.stations.start.x, this.stations.start.y,
      'L', this.stations.end.x, this.stations.end.y,
    ];
    return d.join(' ');
  }


  /**
   * Calculate the route's path length.
   * @return {number} The path length.
   */
  pathLength() {
    return Math.sqrt(
      Math.pow(this.stations.end.x - this.stations.start.x, 2) +
      Math.pow(this.stations.end.y - this.stations.start.y, 2)
    );
  }

}
