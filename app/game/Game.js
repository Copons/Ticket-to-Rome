import './game.css';

import { create } from '../utils/dom';
import { listen } from '../utils/events';
import { APP_CONTAINER } from '../constants/layout';
import { RULES } from '../constants/rules';

import Deck from '../deck/Deck';
import Player from '../player/Player';

export default class Game {

  constructor(numberOfPlayers) {
    this.deck = new Deck();

    this.players = [];
    let i = 0;
    for (; i < numberOfPlayers; i++) {
      this.players.push(new Player(`P${i + 1}`, this.deck));
    }
    this.players[Math.floor(Math.random() * this.players.length)].active = true;
    this.activePlayer = this.players.findIndex(player => player.active);

    this.turn = 1;
    this.turnActions = RULES.turnActions;

    this.playerTurn = this.playerTurn.bind(this);

    this.elements = {
      state: create('div', 'state'),
      turn: create('div', 'turn'),
      activePlayer: create('div', 'active-player'),
    };
    this.render();
  }

  render() {
    this.elements.turn.textContent = `Turn: ${this.turn}`;
    this.elements.activePlayer.textContent = `Active: ${this.players[this.activePlayer].name}`;
    this.elements.state.appendChild(this.elements.turn);
    this.elements.state.appendChild(this.elements.activePlayer);
    APP_CONTAINER.appendChild(this.elements.state);
    listen(APP_CONTAINER, 'click', this.playerTurn);
  }

  renderUpdate() {
    this.elements.turn.textContent = `Turn: ${this.turn}`;
    this.elements.activePlayer.textContent = `Active: ${this.players[this.activePlayer].name}`;
  }

  playerTurn(e) {
    if (this.turnActions > 0) {
      if (e.target === this.deck.element) {
        console.log('deck');
        this.players[this.activePlayer].drawFromDeck(this.deck);
        this.turnActions--;
      }
    }

    if (this.turnActions <= 0) {
      this.players[this.activePlayer].active = false;
      if (this.activePlayer < this.players.length - 1) {
        this.activePlayer++;
      } else {
        this.activePlayer = 0;
      }
      this.players[this.activePlayer].active = true;
      this.turnActions = RULES.turnActions;
      this.turn++;
      this.renderUpdate();
    }
  }

}
