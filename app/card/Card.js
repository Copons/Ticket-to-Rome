import uuid from 'node-uuid';

export default class Card {

  constructor (type) {
    this.id = uuid.v4();
    this.type = type;
  }

}
