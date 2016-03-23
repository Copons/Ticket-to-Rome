/** Class representing a Pub-Sub pattern. */
class PubSub {


  /**
   * Create the PubSub object with an empty list of listeners.
   */
  constructor() {
    this.listeners = new Map();
  }


  /**
   * Subscribe a callback to a topic.
   * @param {string}   label    The topic to subscribe to.
   * @param {Function} callback The function to call when the topic publishes something.
   */
  sub(label, callback) {
    if (!this.listeners.has(label)) {
      this.listeners.set(label, []);
    }
    this.listeners.get(label).push(callback);
  }


  /**
   * Unsbubscribe a callback from a topic.
   * @param  {string}   label    The topic to unsubscribe from.
   * @param  {Function} callback The function to be removed trom the listeners list.
   * @return {boolean}           The outcome of the unsubscription.
   */
  unsub(label, callback) {
    const listeners = this.listeners.get(label);
    if (listeners && listeners.length) {
      this.listeners.set(label, listeners.filter(listener =>
        typeof listener === 'function' && listener === callback
      ));
      return true;
    }
    return false;
  }


  /**
   * Publish something on a topic and call its subscribed callbacks.
   * @param  {string} label   The publishing topic.
   * @param  {Object} ...args The content of the publishing.
   * @return {boolean}        The outcome of the publishing.
   */
  pub(label, ...args) {
    const listeners = this.listeners.get(label);
    if (listeners && listeners.length) {
      for (const listener of listeners) {
        listener(...args);
      }
      return true;
    }
    return false;
  }

}


export default new PubSub();
