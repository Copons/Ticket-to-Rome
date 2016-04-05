import './message.css';
import { create, addClass } from '../../libs/dom';
import { delegate } from '../../libs/events';
import IO from './IO';


/** Class representing the messages popup. */
class Message {


  /**
   * Create the message popup.
   */
  constructor() {
    this.el = document.getElementById('messages');

    // Listen to generic events NOT listened anywhere else
    IO.io.on('Message.Player.joinRoom', this.success);
    IO.io.on('Message.Player.leaveRoom', this.error);

    delegate('.message', this.el, 'click', this.hide);
  }


  /**
   * Show the message popup.
   * @param {string} type    The type of message.
   * @param {string} message The message.
   */
  show = (type, message) => {
    const formattedMessage = message.replace(/\[/g, '<b>').replace(/\]/g, '</b>');
    const newMessage = create('div', {
      class: 'message',
      'data-type': type,
    });
    newMessage.insertAdjacentHTML('afterbegin', formattedMessage);
    this.el.appendChild(newMessage);
    setTimeout(() => {
      this.hide({ target: newMessage });
    }, 3000);
  }


  /**
   * Hide the message popup when clicked.
   */
  hide = e => {
    addClass(e.target, 'hidden');
    setTimeout(() => {
      try {
        this.el.removeChild(e.target);
      } catch (err) {
        // Don't do anything, who cares!
      }
    }, 500);
  }


  /**
   * Shortcut to show a success message.
   * @param {string} message The message to show in the message popup.
   */
  success = message => {
    this.show('success', message);
  }


  /**
   * Shortcut to show an error message.
   * @param {string} message The message to show in the message popup.
   */
  error = message => {
    this.show('error', message);
  }

}


export default new Message();
