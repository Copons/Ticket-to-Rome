import './game.css';
//import { RULES } from '../../config';
import { qs, qsa, addClass, removeClass } from '../../libs/dom';
import IO from '../communications/IO';
import Message from '../communications/Message';
import PubSub from '../communications/PubSub';
import Deck from '../deck/Deck';
import Player from '../player/Player';


export default class Game {

  constructor() {
    this.room = {};
    this.turn = 0;
    this.activePlayer = {};
    this.deck = [];

    this.el = {
      game: document.getElementById('game'),
      info: document.getElementById('info'),
    };
    this.el.turn = qs('.turn .count', this.el.info);
    this.el.players = qs('.players', this.el.info);

    IO.io.on('Game.start', this.start);
    IO.io.on('Game.closed', this.close);
    PubSub.sub('Menu.leaveRoom', this.close);
  }


  start = response => {
    this.room = response.body.room;
    this.turn = 0;
    this.activePlayer = response.body.activePlayer;
    this.deck = new Deck(response.body.deck.cards.length);
    this.render();
  }


  close = response => {
    addClass(this.el.game, 'hidden');
    this.room = {};
    this.turn = 0;
    Message.error(response.message);
  }


  render = () => {
    this.el.turn.textContent = this.turn;
    for (const player of this.room.players) {
      this.el.players.insertAdjacentHTML('beforeend', `
        <div class="player" data-player-id="${player.id}">
          <div class="name ${player.color}">${player.name}</div>
          <div class="pieces">
            <span class="count"></span>
            <span class="icon"></span>
          </div>
          <div class="cards">
            <span class="count"></span>
            <span class="icon"></span>
          </div>
          <div class="destinations">
            <span class="count"></span>
            <span class="icon"></span>
          </div>
        </div>
      `);
    }
    removeClass(this.el.game, 'hidden');
    this.toggleTurnActivation();
  }


  toggleTurnActivation = () => {
    const players = qsa('.player', this.el.players);
    console.log(players);
    [...players].forEach(player => {
      removeClass(player, 'active');
    });
    if (Player.id === this.activePlayer.id) {
      addClass(this.el.game, 'active');
      addClass(qs(`[data-player-id="${Player.id}"]`), 'active');
    } else {
      removeClass(this.el.game, 'active');
    }
  }

}
