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
    this.rooms = [];
    this.room = {};
    this.playerName = sessionGet('ttr_username');
    this.element = this.setupElement();

    this.io.emit('room/list', {});
  }


  setupSocket(io) {
    io.on('connect', () => {
      console.log('Socket.io connected.');
    });

    io.on('room/list', data => {
      this.renderUpdate(data.list);
    });

    return io;
  }


  setupElement() {
    const element = {
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

    if (this.playerName) {
      element.usernameField.value = this.playerName;
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
    //this.rooms = data;
    while (this.element.roomsList.childNodes.length > 1) {
      this.element.roomsList.removeChild(this.element.roomsList.lastChild);
    }

    for (const room of data) {
      const newRoom = new Room(room);
      this.element.roomsList.appendChild(newRoom.element.row);
      listen(newRoom.element.join, 'click', this.joinRoom);
    }

    /*for (const room of this.rooms) {
      const roomElement = create('li', {
        class: 'room',
        'data-room': room.id,
      });
      const roomLink = create('a', {
        href: '#',
        'data-room': room.id,
      });
      roomLink.textContent = `${room.name} (${room.players.length})`;
      roomElement.appendChild(roomLink);
      listen(roomLink, 'click', this.joinRoom);
      this.element.roomsList.appendChild(roomElement);
    }*/
  }

  saveUsername = e => {
    e.preventDefault();
    if (this.element.usernameField.value !== '') {
      sessionSet('ttr_username', this.element.usernameField.value);
      this.playerName = this.element.usernameField.value;
    }
  }


  createRoom = e => {
    e.preventDefault();
    if (!this.playerName) return;
    if (this.element.roomField.value !== '') {
      this.room = this.element.roomField.value;
      this.io.emit('room/create', {
        roomName: this.room,
        playerName: this.playerName,
      });
      console.log(`Created and joined room [${this.room}]`);
    }
  }


  joinRoom = e => {
    e.preventDefault();
    this.room = e.target.dataset.room;
    this.io.emit('room/join', {
      roomId: this.room,
      playerName: this.playerName,
    });
    console.log(`Joined room [${this.room}]`);
  }

}
