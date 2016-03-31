import './menu.css';
import { APP_CONTAINER } from '../../config';
import { listen } from '../../libs/events';
import PubSub from '../../libs/PubSub';


export default class Menu {


  constructor() {
    this.element = {};

    PubSub.sub('User/changed', this.renderUpdateUser);
    PubSub.sub('Game/started', this.renderUpdateStartGame);
    PubSub.sub('Game/leave', this.renderUpdateLeaveGame);
  }


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


  renderUpdateUser = data => {
    this.element.username.textContent = data.name;
  }


  renderUpdateStartGame = room => {
    this.element.usernameForm.classList.add('hidden');
    this.element.room.classList.remove('hidden');
    this.element.roomName.innerHTML = `Room: <b>${room.name}</b>`;
    this.element.roomLeave.dataset.roomId = room.id;
    this.element.roomLeave.dataset.roomName = room.name;
    listen(this.element.roomLeave, 'click', this.leaveGame);
  }


  renderUpdateLeaveGame = () => {
    this.element.usernameForm.classList.remove('hidden');
    this.element.room.classList.add('hidden');
  }


  changeUsername = e => {
    e.preventDefault();
    if (this.element.usernameInput.value !== '') {
      PubSub.pub('User/name', this.element.usernameInput.value);
      this.element.usernameInput.value = '';
    }
  }


  leaveGame = e => {
    e.preventDefault();
    PubSub.pub('Game/leave', e);
  }

}
