import './lobby.css';
import uuid from 'node-uuid';
import { RULES } from '../../config';
import { qs, addClass, removeClass, hasClass } from '../../libs/dom';
import { listen, delegate } from '../../libs/events';
import IO from '../communications/IO';
import Message from '../communications/Message';
import PubSub from '../communications/PubSub';
import Player from '../player/Player';


export default class Lobby {

  constructor() {
    this.el = { lobby: document.getElementById('lobby') };
    this.el.usernameForm = qs('.lobby-username', this.el.lobby);
    this.el.usernameInput = qs('input[type="text"]', this.el.usernameForm);
    this.el.usernameSubmit = qs('input[type="submit"]', this.el.usernameForm);
    this.el.rooms = qs('.lobby-rooms', this.el.lobby);
    this.el.roomsList = qs('tbody', this.el.rooms);
    this.el.roomForm = qs('.lobby-room', this.el.lobby);
    this.el.roomInput = qs('input[type="text"]', this.el.roomForm);
    this.el.roomSubmit = qs('input[type="submit"]', this.el.roomForm);

    IO.io.on('Rooms.getList', this.renderUpdateRooms);
    PubSub.sub('Player.setName', this.renderUpdateUser);
    PubSub.sub('Menu.leaveRoom', this.leaveRoom);
    listen(this.el.usernameSubmit, 'click', this.changeUsername);
    listen(this.el.roomSubmit, 'click', this.createRoom);
    delegate('.join', this.el.roomsList, 'click', this.joinRoom);
    delegate('.leave', this.el.roomsList, 'click', this.leaveRoom);
    delegate('.start', this.el.roomsList, 'click', this.startGame);

    IO.emit('Lobby.getRoomsList', {});
  }


  renderUpdateUser = user => {
    if (user.name === '') {
      removeClass(this.el.usernameForm, 'hidden');
      addClass(this.el.rooms, 'hidden');
      addClass(this.el.roomForm, 'hidden');
    } else {
      addClass(this.el.usernameForm, 'hidden');
      if (this.el.roomsList.hasChildNodes()) {
        removeClass(this.el.rooms, 'hidden');
      }
      removeClass(this.el.roomForm, 'hidden');
    }
  }


  renderUpdateRooms = response => {
    const rooms = response.body;

    this.el.roomsList.innerHTML = '';

    if (rooms.length && Player.name) {
      removeClass(this.el.rooms, 'hidden');
    } else {
      addClass(this.el.rooms, 'hidden');
      return;
    }

    for (const room of rooms) {
      let players = '';
      let actions = '';
      let start = '';

      for (const player of room.players) {
        players += `<span>${player.name}</span>`;
      }

      if (
        room.status === 'open' && Player.name !== '' &&
        room.players.length < RULES.player.max &&
        !room.players.find(p => p.id === Player.id)
      ) {
        actions += `<a
          href="#" class="join"
          data-room-id="${room.id}" data-room-name="${room.name}"
        >Join</a>`;
      }
      if (room.players.find(p => p.id === Player.id)) {
        actions += `<a
          href="#" class="leave"
          data-room-id="${room.id}" data-room-name="${room.name}"
        >Leave</a>`;
      }

      if (room.status === 'open' && room.owner.id === Player.id) {
        start = `<a
          href="#" class="start"
          data-room-id="${room.id}" data-room-name="${room.name}"
        >Start Game</a>`;
      }

      this.el.roomsList.insertAdjacentHTML('afterbegin', `
        <tr>
          <td class="room-name">${start} ${room.name}</td>
          <td class="room-owner">${room.owner.name}</td>
          <td class="room-players">${players}</td>
          <td class="room-status">${room.status}</td>
          <td class="room-actions">${actions}</td>
        </tr>
      `);
    }
  }


  changeUsername = e => {
    e.preventDefault();
    if (this.el.usernameInput.value !== '') {
      Player.setName(this.el.usernameInput.value);
      this.el.usernameInput.value = '';
    }
  }


  createRoom = e => {
    e.preventDefault();
    if (Player.name === '' || this.el.roomInput.value === '') return;

    IO.emit('Lobby.createRoom', {
      id: uuid.v4(),
      name: this.el.roomInput.value,
      owner: Player.simplify(),
      players: [],
      status: 'open',
    })
      .then(response => {
        Message.success(response.message);
      })
      .catch(response => {
        Message.error(response.message);
      });
    this.el.roomInput.value = '';
  }


  joinRoom = e => {
    e.preventDefault();
    if (Player.name === '') return;

    IO.emit('Lobby.joinRoom', {
      room: {
        id: e.target.dataset.roomId,
        name: e.target.dataset.roomName,
      },
      player: Player.simplify(),
    })
      .then(response => {
        Message.success(response.message);
      })
      .catch(response => {
        Message.error(response.message);
      });
  }


  leaveRoom = e => {
    e.preventDefault();
    if (Player.name === '') return;

    IO.emit('Lobby.leaveRoom', {
      room: {
        id: e.target.dataset.roomId,
        name: e.target.dataset.roomName,
      },
      player: Player.simplify(),
    })
      .then(response => {
        if (hasClass(this.el.lobby, 'hidden')) {
          this.show();
        }
        Message.success(response.message);
      })
      .catch(response => {
        Message.error(response.message);
      });
  }


  startGame = e => {
    e.preventDefault();
    if (Player.name === '') return;

    IO.emit('Lobby.startGame', {
      id: e.target.dataset.roomId,
      name: e.target.dataset.roomName,
    })
      .then(response => {
        Message.success(response.message);
        this.hide();
      })
      .catch(response => {
        Message.error(response.message);
      });
  }


  show() {
    removeClass(this.el.lobby, 'hidden');
    IO.io.on('Rooms.getList', this.renderUpdateRooms);
    IO.emit('Lobby.getRoomsList', {});
  }


  hide() {
    addClass(this.el.lobby, 'hidden');
    IO.io.off('Rooms.getList', this.renderUpdateRooms);
  }

}
