import './message.css';
import { APP_CONTAINER } from '../../config';
import { create } from '../../libs/dom';
import { listen } from '../../libs/events';


class Message {

  constructor() {
    this.element = create('div', { class: 'message hidden' });
    APP_CONTAINER.appendChild(this.element);

    listen(this.element, 'click', this.hide);
  }

  show = data => {
    this.element.classList.remove('hidden');
    this.element.dataset.type = data.type;
    this.element.innerHTML = data.message;
  }

  hide = () => {
    this.element.classList.add('hidden');
    setTimeout(() => {
      this.element.dataset.type = '';
      this.element.innerHTML = '';
    }, 200);
  }

}

export default new Message();
