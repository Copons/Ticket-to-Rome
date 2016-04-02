import './message.css';
import { APP_CONTAINER } from '../../config';
import { create } from '../../libs/dom';
import { listen } from '../../libs/events';


/** Class representing the messages popup. */
class Message {


  /**
   * Create the message popup.
   */
  constructor() {
    this.element = create('div', { class: 'message hidden' });
    APP_CONTAINER.appendChild(this.element);

    listen(this.element, 'click', this.hide);
  }


  /**
   * Show the message popup.
   * @param {string} type    The type of message.
   * @param {string} message The message.
   */
  show = (type, message) => {
    this.element.classList.remove('hidden');
    this.element.dataset.type = type;
    this.element.innerHTML = message;
  }


  /**
   * Hide the message popup when clicked.
   */
  hide = () => {
    this.element.classList.add('hidden');
    setTimeout(() => {
      this.element.dataset.type = '';
      this.element.innerHTML = '';
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
