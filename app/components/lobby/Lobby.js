import 'lobby.css';
import { qs, addClass, removeClass } from '../../libs/dom';
import { listen } from '../../libs/events';
import PubSub from '../communications/PubSub';


export default class Lobby {

  constructor() {
    this.el = { lobby: document.getElementById('lobby') };
    this.el.usernameForm = qs('.lobby-username', this.el.lobby);
    this.el.usernameInput = qs('input[type="text"]', this.el.usernameForm);
    this.el.usernameSubmit = qs('input[type="submit"]', this.el.usernameForm);
    this.el.rooms = qs('table.rooms', this.el.lobby);
    this.el.roomsList = qs('tbody', this.el.rooms);
    this.el.roomForm = qs('.lobby-room', this.el.lobby);
    this.el.roomInput = qs('input[type="text"]', this.el.roomForm);
    this.el.roomSubmit = qs('input[type="submit"]', this.el.roomForm);

    PubSub.sub('Player.setName', this.renderUpdateUser);
    listen(this.el.usernameSubmit, 'click', this.changeUsername);
  }


  renderUpdateUser = user => {
    if (user.name === '') {
      removeClass(this.el.usernameForm, 'hidden');
      addClass(this.el.rooms, 'hidden');
      addClass(this.el.roomForm, 'hidden');
    } else {
      addClass(this.el.usernameForm, 'hidden');
      removeClass(this.el.rooms, 'hidden');
      removeClass(this.el.roomForm, 'hidden');
    }
  }


  changeUsername = e => {
    e.preventDefault();
    if (this.el.usernameInput.value !== '') {
      PubSub.pub('Lobby.changeUsername', this.el.usernameInput.value);
      this.el.usernameInput.value = '';
    }
  }
}
