export default class Layout {

  constructor (numberOfPlayers) {
    this.numberOfPlayers = numberOfPlayers;
    this.container = document.getElementById('ttr');
  }

  drawBoard () {
    this.container.insertAdjacentHTML('beforeend', '<div id="board"></div>');
  }

  drawDeck () {
    this.container.insertAdjacentHTML('afterbegin', '<div id="deck"></div>');
  }

}
