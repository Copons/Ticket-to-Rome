import './menu.css';
import { APP_CONTAINER } from '../../config';
import { listen } from '../../libs/events';
import PubSub from '../../libs/PubSub';


export default class Menu {


  constructor() {
    this.element = {};

    PubSub.sub('User/changed', this.renderUpdateUser);
  }


  render() {
    APP_CONTAINER.insertAdjacentHTML('afterbegin', `
      <div class="menu">
        <div class="menu-title">TTR</div>
        <div class="menu-item">
          <a href="#" class="menu-username">
            <span></span>
            <form class="submenu">
              <input name="username" type="text" placeholder="Change name">
              <input type="submit" value="Save">
            </form>
          </a>
        </div>
      </div>
    `);
    const menu = APP_CONTAINER.querySelector('.menu');
    this.element = {
      menu,
      username: menu.querySelector('.menu-username span'),
      usernameInput: menu.querySelector('.menu-username input[type="text"]'),
      usernameSubmit: menu.querySelector('.menu-username input[type="submit"]'),
    };
    listen(this.element.usernameSubmit, 'click', this.changeUsername);
  }


  renderUpdateUser = data => {
    this.element.username.textContent = data.name;
  }


  changeUsername = e => {
    e.preventDefault();
    if (this.element.usernameInput.value !== '') {
      PubSub.pub('User/name', this.element.usernameInput.value);
      this.element.usernameInput.value = '';
    }
  }

}
