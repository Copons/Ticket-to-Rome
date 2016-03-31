import './lobby.css';
import uuid from 'node-uuid';
import { APP_CONTAINER, RULES } from '../../config';
import { listen } from '../../libs/events';
import Message from '../message';
import PubSub from '../../libs/PubSub';


/** Class representing the lobby. */
export default class Lobby {


  /**
   * Create the lobby.
   * @param {Socket} io   The Socket.io client.
   * @param {User}   user The current user.
   */
  constructor(io, user) {
    this.io = io;
    this.user = {
      id: user.id,
      name: user.name,
    };
    this.rooms = [];

    this.io.emit('Rooms/list', {});
    this.io.on('Rooms/list', rooms => {
      this.rooms = rooms.list;
      this.renderUpdateRooms();
    });

    PubSub.sub('User/changed', this.renderUpdateUser);
    PubSub.sub('Game/leave', this.leaveRoom);
  }


  /**
   * Render the lobby into the app container.
   */
  render() {
    APP_CONTAINER.insertAdjacentHTML('afterbegin', `
      <div class="lobby hidden">
        <form class="usernameForm hidden">
          <input name="username" type="text" placeholder="Change name">
          <input type="submit" value="Save">
        </form>
        <table class="rooms hidden">
          <thead>
            <tr>
              <th>Room</th>
              <th>Owner</th>
              <th>Players</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
        <form class="roomForm hidden">
          <input name="room" type="text" placeholder="New room">
          <input type="submit" value="Create">
        </form>
      </div>
    `);
    const lobby = APP_CONTAINER.querySelector('.lobby');
    this.element = {
      lobby,
      usernameForm: lobby.querySelector('.usernameForm'),
      usernameInput: lobby.querySelector('.usernameForm input[type="text"]'),
      usernameSubmit: lobby.querySelector('.usernameForm input[type="submit"]'),
      rooms: lobby.querySelector('table.rooms'),
      roomsList: lobby.querySelector('table.rooms tbody'),
      roomForm: lobby.querySelector('.roomForm'),
      roomInput: lobby.querySelector('.roomForm input[type="text"]'),
      roomSubmit: lobby.querySelector('.roomForm input[type="submit"]'),
    };
    listen(this.element.usernameSubmit, 'click', this.changeUsername);
    listen(this.element.roomSubmit, 'click', this.createRoom);

    if (this.user.name === '') {
      this.element.usernameForm.classList.remove('hidden');
    }

    this.show();
  }


  /**
   * Update the lobby when a user is changed.
   * @param {Object} data The data emitted when a user is changed.
   */
  renderUpdateUser = data => {
    this.user = {
      id: data.id,
      name: data.name,
      room: data.room,
    };
    if (data.name !== '') {
      this.element.usernameForm.classList.add('hidden');
      this.element.roomForm.classList.remove('hidden');
      this.renderUpdateRooms();
    } else {
      this.element.usernameForm.classList.remove('hidden');
      this.element.roomForm.classList.add('hidden');
    }
  }


  /**
   * Update the lobby when the rooms are changed.
   */
  renderUpdateRooms = () => {
    while (this.element.roomsList.firstChild) {
      this.element.roomsList.removeChild(this.element.roomsList.firstChild);
    }

    if (this.rooms.length > 0) {
      this.element.rooms.classList.remove('hidden');
    } else {
      this.element.rooms.classList.add('hidden');
      return;
    }

    for (const room of this.rooms) {
      let actions = '';
      let players = '';

      for (const player of room.players) {
        players += `<span>${player.name}</span>`;
      }

      if (
        room.status === 'open' && this.user.name !== '' &&
        room.players.length < RULES.player.max &&
        !room.players.find(p => p.id === this.user.id)
      ) {
        actions += `<a
          href="#" class="join"
          data-room-id="${room.id}" data-room-name="${room.name}"
        >Join</a>`;
      }
      if (room.players.find(p => p.id === this.user.id)) {
        actions += `<a
          href="#" class="leave"
          data-room-id="${room.id}" data-room-name="${room.name}"
        >Leave</a>`;
      }

      let start = '';
      if (room.status === 'open' && room.owner.id === this.user.id) {
        start = `<a
          href="#" class="start"
          data-room-id="${room.id}" data-room-name="${room.name}"
        >Start Game</a>`;
      }

      this.element.roomsList.insertAdjacentHTML('afterbegin',`
        <tr>
          <td class="room-name">${start} ${room.name}</td>
          <td class="room-owner">${room.owner.name}</td>
          <td class="room-players">${players}</td>
          <td class="room-status">${room.status}</td>
          <td class="room-actions">${actions}</td>
        </tr>
      `);

      if (start !== '') {
        const startButton = this.element.roomsList.querySelector('.start');
        listen(startButton, 'click', this.startGame);
      }
    }

    const joinButtons = this.element.roomsList.querySelectorAll('.join');
    const leaveButtons = this.element.roomsList.querySelectorAll('.leave');
    for (const join of [...joinButtons]) {
      listen(join, 'click', this.joinRoom);
    }
    for (const leave of [...leaveButtons]) {
      listen(leave, 'click', this.leaveRoom);
    }
  }


  /**
   * Dispatch a change username event.
   * @param {Event} e The click event.
   */
  changeUsername = e => {
    e.preventDefault();
    if (this.element.usernameInput.value !== '') {
      PubSub.pub('User/name', this.element.usernameInput.value);
      this.element.usernameInput.value = '';
    }
  }


  /**
   * Create a room.
   * @param {Event} e The click event.
   */
  createRoom = e => {
    e.preventDefault();
    if (this.user.name === '') return;
    if (this.element.roomInput.value !== '') {
      const room = {
        id: uuid.v4(),
        name: this.element.roomInput.value,
        owner: this.user,
        players: [],
        status: 'open',
      };
      this.io.emit('Rooms/create', room, response => {
        if (response === 'ok') {
          Message.show({
            type: 'success',
            message: 'Room created!',
          });
        } else {
          Message.show({
            type: 'error',
            message: response,
          });
        }
      });
      this.element.roomInput.value = '';
    }
  }

  /**
   * Join a room.
   * @param {Event} e The click event.
   */
  joinRoom = e => {
    e.preventDefault();
    if (this.user.name === '') return;
    const room = {
      id: e.target.dataset.roomId,
      name: e.target.dataset.roomName,
    };
    this.io.emit('Rooms/join', {
      room,
      player: this.user,
    }, response => {
      if (response === 'ok') {
        Message.show({
          type: 'success',
          message: `Joined room <b>${room.name}</b>!`,
        });
      } else {
        Message.show({
          type: 'error',
          message: response,
        });
      }
    });
  }


  /**
   * Leave a room.
   * @param {Event} e The click event.
   */
  leaveRoom = e => {
    e.preventDefault();
    if (this.user.name === '') return;
    const room = {
      id: e.target.dataset.roomId,
      name: e.target.dataset.roomName,
    };
    this.io.emit('Rooms/leave', {
      room,
      player: this.user,
    }, response => {
      if (response === 'ok') {
        Message.show({
          type: 'success',
          message: `Left room <b>${room.name}</b>!`,
        });
      } else {
        Message.show({
          type: 'error',
          message: response,
        });
      }
    });
  }


  /**
   * Start a game.
   * @param {Event} e The click event.
   */
  startGame = e => {
    e.preventDefault();
    if (this.user.name === '') return;
    const room = {
      id: e.target.dataset.roomId,
      name: e.target.dataset.roomName,
    };
    this.io.emit('Rooms/start', room, response => {
      if (response === 'ok') {
        PubSub.pub('Game/started', room);
        Message.show({
          type: 'success',
          message: `Starting game in room <b>${room.name}</b>!`,
        });
      } else {
        Message.show({
          type: 'error',
          message: response,
        });
      }
    });
  }


  /**
   * Show the lobby.
   */
  show() {
    this.element.lobby.classList.remove('hidden');
  }


  /**
   * Hide the lobby.
   */
  hide() {
    this.element.lobby.classList.add('hidden');
  }

}
