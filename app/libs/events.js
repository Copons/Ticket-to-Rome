import { qsa } from './dom.js';


/**
 * addEventListener alias
 * Registers the specified listener on the target it's called on.
 * @param {Element}  target             The target element.
 * @param {string}   eventType          The event type to register.
 * @param {Function} callback           The event callback function.
 * @param {boolean}  [useCapture=false] Force the event to activate at the beginning.
 */
export function listen(target, eventType, callback, useCapture = false) {
  if (target) {
    target.addEventListener(eventType, callback, !!useCapture);
  }
}


/**
 * Delegates an event listener.
 * @param  {string}   targetSelector The target selector.
 * @param  {Element}  container      The container of the target selector.
 * @param  {string}   eventType      The event type to register.
 * @param  {Function} callback       The event callback function.
 */
export function delegate(targetSelector, container, eventType, callback) {
  const dispatchEvent = event => {
    const targetElement = event.target;
    const potentialElements = qsa(targetSelector, container);
    const hasMatch = Array.from(potentialElements).includes(targetElement);
    if (hasMatch) {
      callback.call(targetElement, event);
    }
  };
  const useCapture = eventType === 'blur' || eventType === 'focus';
  listen(container, eventType, dispatchEvent, useCapture);
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
