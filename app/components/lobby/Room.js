import { create } from '../../libs/dom';


export default class Rooms {

  constructor(room) {
    this.id = room.id;
    this.name = room.name;
    this.owner = room.owner;
    this.players = room.players;
    this.element = this.setupElement();
  }


  setupElement() {
    const element = {
      row: create('tr', {}),
      cells: {
        name: create('td', { class: 'room-name' }),
        owner: create('td', { class: 'room-owner' }),
        players: create('td', { class: 'room-players' }),
        join: create('td', { class: 'room-join' }),
      },
      join: create('a', {
        class: 'join',
        href: '#',
        'data-room': this.id,
      }),
    };

    element.cells.name.insertAdjacentHTML('beforeend', `<b>${this.name}</b>`);
    element.cells.owner.insertAdjacentHTML('beforeend', `<span>${this.owner.name}</span>`);

    for (const player of this.players) {
      element.cells.players.insertAdjacentHTML('beforeend', `<span>${player.name}</span>`);
    }

    element.join.textContent = 'Join';
    element.cells.join.appendChild(element.join);

    element.row.appendChild(element.cells.name);
    element.row.appendChild(element.cells.owner);
    element.row.appendChild(element.cells.players);
    element.row.appendChild(element.cells.join);
    return element;
  }

}
