import './message.css';
import { addClass, removeClass } from '../../libs/dom';
import { listen } from '../../libs/events';


/** Class representing the messages popup. */
class Message {


  /**
   * Create the message popup.
   */
  constructor() {
    this.el = document.getElementById('message');

    listen(this.el, 'click', this.hide);
  }


  /**
   * Show the message popup.
   * @param {string} type    The type of message.
   * @param {string} message The message.
   */
  show = (type, message) => {
    removeClass(this.el, 'hidden');
    this.el.dataset.type = type;
    this.el.innerHTML = message.replace(/\[/g, '<b>').replace(/\]/g, '</b>');
  }


  /**
   * Hide the message popup when clicked.
   */
  hide = () => {
    addClass(this.el, 'hidden');
    setTimeout(() => {
      this.el.dataset.type = '';
      this.el.innerHTML = '';
    }, 200);
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
