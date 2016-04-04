import './menu.css';
import { qs, addClass, removeClass } from '../../libs/dom';
import { listen, delegate } from '../../libs/events';
import IO from '../communications/IO';
import PubSub from '../communications/PubSub';
import Player from '../player/Player';


export default class Menu {


  constructor() {
    this.el = { menu: document.getElementById('menu') };
    this.el.username = qs('.menu-username', this.el.menu);
    this.el.usernameName = qs('.menu-username > span', this.el.menu);
    this.el.usernameSubmenu = qs('.submenu', this.el.username);
    this.el.usernameInput = qs('input[type="text"]', this.el.usernameSubmenu);
    this.el.usernameSubmit = qs('input[type="submit"]', this.el.usernameSubmenu);
    this.el.room = qs('.menu-room', this.el.menu);
    this.el.roomName = qs('.menu-room > span', this.el.menu);
    this.el.roomLeave = qs('.leave', this.el.room);
    this.el.roomSubmenu = qs('.submenu', this.el.room);

    IO.io.on('Game.start', this.renderUpdateStartGame);
    PubSub.sub('Player.setName', this.renderUpdateUser);
    listen(this.el.usernameSubmit, 'click', this.changeUsername);
    delegate('.leave', this.el.room, 'click', this.leaveRoom);
  }


  renderUpdateUser = user => {
    this.el.usernameName.textContent = user.name;
    if (user.name === '') {
      addClass(this.el.username, 'hidden');
    } else {
      removeClass(this.el.username, 'hidden');
    }
  }


  renderUpdateStartGame = response => {
    const room = response.body;
    this.el.roomName.textContent = room.name;
    this.el.roomLeave.dataset.roomId = room.id;
    this.el.roomLeave.dataset.roomName = room.name;

    let players = '';
    for (const player of room.players) {
      players += '<div class="room-player">';
      players += player.name;
      if (player.id === room.owner.id) {
        players += ' <span class="room-owner">(Owner)</span>';
      }
      if (player.id === Player.id) {
        players += ' <span class="room-you">(You)</span>';
      }
      players += '</div>';
    }

    this.el.roomSubmenu.innerHTML = players;
    removeClass(this.el.room, 'hidden');
    addClass(this.el.usernameSubmenu, 'hidden');
  }


  changeUsername = e => {
    e.preventDefault();
    if (this.el.usernameInput.value === '') return;

    Player.setName(this.el.usernameInput.value);
    this.el.usernameInput.value = '';
  }


  leaveRoom = e => {
    e.preventDefault();
    PubSub.pub('Menu.leaveRoom', e);
    this.el.roomSubmenu.innerHTML = '';
    addClass(this.el.room, 'hidden');
    removeClass(this.el.usernameSubmenu, 'hidden');
  }

}
