import './menu.css';
import { qs, addClass, removeClass } from '../../libs/dom';
import { listen } from '../../libs/events';
import PubSub from '../communications/PubSub';


export default class Menu {


  constructor() {
    this.el = { menu: document.getElementById('menu') };
    this.el.username = qs('.menu-username', this.el.menu);
    this.el.usernameName = qs('.menu-username > span', this.el.menu);
    this.el.usernameInput = qs('input[type="text"]', this.el.username);
    this.el.usernameSubmit = qs('input[type="submit"]', this.el.username);
    this.el.room = qs('.menu-room', this.el.menu);
    this.el.roomName = qs('.menu-room > span', this.el.menu);
    this.el.roomLeave = qs('.menu-room > a', this.el.menu);
    this.el.roomSubmenu = qs('.submenu', this.el.room);

    PubSub.sub('Player.setName', this.renderUpdateUser);
    listen(this.el.usernameSubmit, 'click', this.changeUsername);
  }


  renderUpdateUser = user => {
    this.el.usernameName.textContent = user.name;
    if (user.name === '') {
      addClass(this.el.username, 'hidden');
    } else {
      removeClass(this.el.username, 'hidden');
    }
  }


  changeUsername = e => {
    e.preventDefault();
    if (this.el.usernameInput.value !== '') {
      PubSub.pub('Menu.changeUsername', this.el.usernameInput.value);
      this.el.usernameInput.value = '';
    }
  }

}
