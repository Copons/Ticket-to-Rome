/**
 * addEventListener alias
 * Registers the specified listener on the target it's called on.
 * @param {Element}  target             The target element.
 * @param {string}   eventType          The event type to register.
 * @param {Function} callback           The event callback function.
 * @param {boolean}  [useCapture=false] Forces the event to activate at the beginning.
 */
export function listen(target, eventType, callback, useCapture = false) {
  if (target) {
    target.addEventListener(eventType, callback, !!useCapture);
  }
}

/**
 * Create and dispatch a custom event.
 * @param {Element} target    The target element.
 * @param {string}  eventType The event type to register.
 * @param {Object}  detail    The custom event detail.
 */
export function customEvent(target, eventType, detail) {
  const customEventHandler = new CustomEvent(eventType, { detail });
  target.dispatchEvent(customEventHandler);
}
