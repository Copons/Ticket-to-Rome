import './lobby.css';
import { APP_CONTAINER } from '../../config';
import { create } from '../../libs/dom';
import { listen } from '../../libs/events';
//import { localStorageSet, localStorageGet } from '../../libs/storage';
import { sessionSet, sessionGet } from '../../libs/storage';
import Room from './Room';


export default class Lobby {


  constructor(io) {
    this.io = this.setupSocket(io);
    this.player = {};
    this.element = this.setupElement();

    this.setupPlayer();

    this.io.emit('Rooms/list', {});
  }


  setupPlayer() {
    const playerName = sessionGet('ttr_username');
    if (playerName) {
      this.player.name = playerName;
      this.element.usernameField.value = this.player.name;
      this.io.emit('Players/add', { name: this.player.name });
    }
  }


  setupSocket(io) {
    io.on('connect', () => {
      console.log('Socket.io connected.');
    });

    io.on('Rooms/list', data => {
      this.renderUpdate(data.list);
    });

    io.on('Players/add/details', data => {
      this.player = data;
      sessionSet('ttr_username', data.name);
    });

    io.on('Players/add/error', data => {
      console.log(data);
      this.element.usernameField.value = this.player.name;
    });

    return io;
  }


  setupElement() {
    const element = {
      container: create('div', { class: 'lobby-container' }),
      lobby: create('div', { class: 'lobby' }),
      usernameForm: create('form', {
        class: 'form-username',
        action: '#',
      }),
      usernameField: create('input', {
        name: 'username',
        type: 'text',
        placeholder: 'Username',
      }),
      usernameSubmit: create('input', {
        value: 'Save',
        type: 'submit',
      }),
      roomsList: create('table', { class: 'rooms' }),
      roomForm: create('form', {
        class: 'form-room',
        action: '#',
      }),
      roomField: create('input', {
        name: 'roomName',
        type: 'text',
        placeholder: 'Room Name',
      }),
      roomSubmit: create('input', {
        value: 'Create',
        type: 'submit',
      }),
    };

    if (this.player.name) {
      element.usernameField.value = this.player.name;
    }

    listen(element.usernameSubmit, 'click', this.saveUsername);
    listen(element.roomSubmit, 'click', this.createRoom);
    return element;
  }


  render() {
    this.element.usernameForm.appendChild(this.element.usernameField);
    this.element.usernameForm.appendChild(this.element.usernameSubmit);
    this.element.lobby.appendChild(this.element.usernameForm);

    this.element.roomsList.insertAdjacentHTML('afterbegin', `<tr>
      <th>Name</th>
      <th>Owner</th>
      <th>Players</th>
      <th></th>
    </tr>`);
    this.element.lobby.appendChild(this.element.roomsList);

    this.element.roomForm.appendChild(this.element.roomField);
    this.element.roomForm.appendChild(this.element.roomSubmit);
    this.element.lobby.appendChild(this.element.roomForm);

    APP_CONTAINER.appendChild(this.element.lobby);
  }


  renderUpdate = data => {
    while (this.element.roomsList.childNodes.length > 1) {
      this.element.roomsList.removeChild(this.element.roomsList.lastChild);
    }

    for (const room of data) {
      const newRoom = new Room(room, this.player);
      this.element.roomsList.appendChild(newRoom.element.row);
      listen(newRoom.element.join, 'click', this.joinRoom);
      listen(newRoom.element.leave, 'click', this.leaveRoom);
    }
  }

  saveUsername = e => {
    e.preventDefault();
    if (this.element.usernameField.value !== '') {
      this.io.emit('Players/add', { name: this.element.usernameField.value });
    }
  }


  createRoom = e => {
    e.preventDefault();
    if (!this.player) return;
    if (this.element.roomField.value !== '') {
      const room = {
        name: this.element.roomField.value,
      };
      this.io.emit('Rooms/create', { room, player: this.player });
      console.log(`Created and joined room [${room.name}]`);
      this.element.roomField.value = '';
    }
  }


  joinRoom = e => {
    e.preventDefault();
    const room = {
      id: e.target.dataset.roomId,
      name: e.target.dataset.roomName,
    };
    this.io.emit('Rooms/join', { room, player: this.player });
    console.log(`Joined room [${room.name}]`);
  }


  leaveRoom = e => {
    e.preventDefault();
    const room = {
      id: e.target.dataset.roomId,
      name: e.target.dataset.roomName,
    };
    this.io.emit('Rooms/leave', { room, player: this.player });
    console.log(`Left room [${room.name}]`);
  }

}
