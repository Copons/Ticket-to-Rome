import './menu.css';
import { APP_CONTAINER } from '../../config';
import { listen } from '../../libs/events';
import PubSub from '../../libs/PubSub';


/** Class representing the menu. */
export default class Menu {


  /**
   * Create the menu.
   */
  constructor() {
    this.element = {};

    PubSub.sub('User/changed', this.renderUpdateUser);
    PubSub.sub('Game/started', this.renderUpdateStartGame);
    PubSub.sub('Game/leave', this.renderUpdateLeaveGame);
  }


  /**
   * Render the menu into the app container.
   */
  render() {
    APP_CONTAINER.insertAdjacentHTML('afterbegin', `
      <div class="menu">
        <div class="menu-title">TTR</div>
        <div class="menu-item menu-username">
          <span></span>
          <form class="submenu">
            <input name="username" type="text" placeholder="Change name">
            <input type="submit" value="Save">
          </form>
        </div>
        <div class="menu-item menu-room hidden">
          <span></span>
          <a href="#">(Leave)</a>
        </div>
      </div>
    `);
    const menu = APP_CONTAINER.querySelector('.menu');
    this.element = {
      menu,
      username: menu.querySelector('.menu-username span'),
      usernameForm: menu.querySelector('.menu-username form'),
      usernameInput: menu.querySelector('.menu-username input[type="text"]'),
      usernameSubmit: menu.querySelector('.menu-username input[type="submit"]'),
      room: menu.querySelector('.menu-room'),
      roomName: menu.querySelector('.menu-room span'),
      roomLeave: menu.querySelector('.menu-room a'),
    };
    listen(this.element.usernameSubmit, 'click', this.changeUsername);
  }


  /**
   * Update the menu when the current user is changed.
   * @param {Object} data The data emitted when the current user is changed.
   */
  renderUpdateUser = data => {
    this.element.username.textContent = data.name;
  }


  /**
   * Update the menu when a game is started.
   * @param {Object} room The data emitted when a game is started.
   */
  renderUpdateStartGame = room => {
    this.element.usernameForm.classList.add('hidden');
    this.element.room.classList.remove('hidden');
    this.element.roomName.innerHTML = `Room: <b>${room.name}</b>`;
    this.element.roomLeave.dataset.roomId = room.id;
    this.element.roomLeave.dataset.roomName = room.name;
    listen(this.element.roomLeave, 'click', this.leaveGame);
  }


  /**
   * Update the menu when the current user leaves the game.
   */
  renderUpdateLeaveGame = () => {
    this.element.usernameForm.classList.remove('hidden');
    this.element.room.classList.add('hidden');
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
   * Leave the game.
   * @param {Event} e The click event.
   */
  leaveGame = e => {
    e.preventDefault();
    PubSub.pub('Game/leave', e);
  }

}
