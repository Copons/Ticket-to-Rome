import './score.css';
import { create, qs, addClass } from '../../libs/dom';


export default class Score {

  constructor(players) {
    this.score = players;

    this.el = {
      score: document.getElementById('score'),
      players: this.setupPlayerElements(),
    };
  }

  setupPlayerElements() {
    const players = [];
    for (const player of this.score) {
      const score = create('div', {
        class: 'player',
        'data-player-id': player.id,
      });

      let destinationList = '';
      for (const destination of player.destinations) {
        destinationList += `
          <div
            class="destination ${destination.completed ? 'completed' : 'failed'}"
            data-destination="${destination.id}"
          >
            ${destination.name} <span>(${destination.points})</span>
          </div>
        `;

        if (destination.completed) {
          player.points += destination.points;
        }
      }

      const pointsPercentage = player.points / 150 * 100;

      score.insertAdjacentHTML('beforeend', `
        <h3>${player.name}</h3>
        <div class="points">
          <div class="destinations">${destinationList}</div>
          <div class="points-bar">
            <div class="bar" style="width: ${pointsPercentage}%"></div>
          </div>
          <div class="total-points">${player.points}</div>
        </div>
      `);
      players.push(score);
    }
    return players;
  }


  render() {
    while (this.el.score.firstChild) {
      this.el.score.removeChild(this.el.score.firstChild);
    }
    for (const player of this.el.players) {
      this.el.score.appendChild(player);
    }
  }


  theWinnerIs() {
    let winners = [];
    for (const player of this.score) {
      if (winners.length === 0) {
        winners.push(player);
      } else if (player.points > winners[0].points) {
        winners = [];
        winners.push(player);
      } else if (player.points === winners[0].points) {
        winners.push(player);
      }
    }

    for (const player of winners) {
      const score = qs(`.player[data-player-id="${player.id}"]`, this.el.score);
      addClass(score, 'winner');
    }
  }

}
