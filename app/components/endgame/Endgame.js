import './endgame.css';
import { qs, addClass, removeClass } from '../../libs/dom';
import { listen } from '../../libs/events';
import IO from '../communications/IO';
import Score from './Score';


export default class Endgame {

  constructor(game) {
    this.game = game;
    this.debugScore();
    this.score = new Score(this.players);

    this.el = document.getElementById('endgame');
  }


  render() {
    this.score.render();
    listen(qs('.close', this.el), 'click', this.close);
  }


  theWinnerIs() {
    this.score.theWinnerIs();
    removeClass(this.el, 'hidden');
  }


  close = () => {
    IO.emit('Endgame.close', this.game)
      .then(response => {
        console.log(response);
        addClass(this.el, 'hidden');
      });
  }


  debugScore() {
    this.players = [
      {
        id: '11111',
        name: 'Player 1',
        points: 35,
        destinations: [
          {
            id: '11111',
            name: 'Termini - Rebibbia',
            points: 10,
            completed: true,
          },
          {
            id: '22222',
            name: 'Ottaviano - Battistini',
            points: 3,
            completed: false,
          },
          {
            id: '33333',
            name: 'Ojetti - Venezia',
            points: 15,
            completed: true,
          },
        ],
      },
      {
        id: '22222',
        name: 'Player 2',
        points: 81,
        destinations: [
          {
            id: '44444',
            name: 'Termini - Rebibbia',
            points: 10,
            completed: false,
          },
          {
            id: '55555',
            name: 'Ottaviano - Battistini',
            points: 3,
            completed: false,
          },
          {
            id: '66666',
            name: 'Ojetti - Venezia',
            points: 15,
            completed: false,
          },
        ],
      },
      {
        id: '33333',
        name: 'Player 3',
        points: 57,
        destinations: [
          {
            id: '77777',
            name: 'Termini - Rebibbia',
            points: 10,
            completed: true,
          },
          {
            id: '88888',
            name: 'Ottaviano - Battistini',
            points: 3,
            completed: false,
          },
          {
            id: '99999',
            name: 'Ojetti - Venezia',
            points: 15,
            completed: false,
          },
        ],
      },
      /*{
        id: '44444',
        name: 'Player 4',
        points: 40,
      },
      {
        id: '55555',
        name: 'Player 5',
        points: 69,
      },*/
    ];
  }

}
