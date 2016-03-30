import { RULES } from '../../config';
import { create } from '../../libs/dom';


export default class Rooms {

  constructor(room, player) {
    this.id = room.id;
    this.name = room.name;
    this.owner = room.owner;
    this.players = room.players;
    this.element = this.setupElement(player);
  }


  setupElement(currentPlayer) {
    const element = {
      row: create('tr', {}),
      cells: {
        name: create('td', { class: 'room-name' }),
        owner: create('td', { class: 'room-owner' }),
        players: create('td', { class: 'room-players' }),
        actions: create('td', { class: 'room-actions' }),
      },
      join: create('a', {
        class: 'join',
        href: '#',
        'data-room-id': this.id,
        'data-room-name': this.name,
      }),
      leave: create('a', {
        class: 'leave',
        href: '#',
        'data-room-id': this.id,
        'data-room-name': this.name,
      }),
    };

    element.cells.name.insertAdjacentHTML('beforeend', `<b>${this.name}</b>`);
    element.cells.owner.insertAdjacentHTML('beforeend', `<span>${this.owner.name}</span>`);

    for (const player of this.players) {
      element.cells.players.insertAdjacentHTML('beforeend', `<span>${player.name}</span>`);
    }

    console.log(this.players);
    console.log(currentPlayer);

    if (
      this.players.length < RULES.player.max &&
      !this.players.find(p => p.id === currentPlayer.id)
    ) {
      element.join.textContent = 'Join';
      element.cells.actions.appendChild(element.join);
    }
    if (this.players.find(p => p.id === currentPlayer.id)) {
      element.leave.textContent = 'Leave';
      element.cells.actions.appendChild(element.leave);
    }

    element.row.appendChild(element.cells.name);
    element.row.appendChild(element.cells.owner);
    element.row.appendChild(element.cells.players);
    element.row.appendChild(element.cells.actions);
    return element;
  }

}
