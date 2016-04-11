/**
 * querySelector alias
 * Returns the first element within the document that matches the specified group of selectors.
 * @param  {string}  selector                  The CSS selector to search.
 * @param  {Element} [container=document.body] The container in which to search.
 * @return {Element}
 */
export function qs(selector, container = document.body) {
  if (!container) {
    return null;
  }
  return container.querySelector(selector);
}


/**
 * querySelectorAll alias
 * Returns a list of the elements within the document that match the specified group of selectors.
 * @param  {string}   selector                  The CSS selector to search.
 * @param  {Element}  [container=document.body] The container in which to search.
 * @return {NodeList} The matched element.
 */
export function qsa(selector, container = document.body) {
  if (!container) {
    return [];
  }
  return container.querySelectorAll(selector);
}


/**
 * Create a HTML element.
 * @param  {string}  tag       The element tag name.
 * @param  {Object}  [args={}] The element attributes.
 * @return {Element}
 */
export function create(tag, args = {}) {
  const element = document.createElement(tag);
  for (const arg in args) {
    element.setAttribute(arg, args[arg]);
  }
  return element;
}


/**
 * Create a SVG element.
 * @param  {string}  tag       The element tag name.
 * @param  {Object}  [args={}] The element attributes.
 * @return {Element}
 */
export function createSvg(tag, args = {}) {
  const element = document.createElementNS('http://www.w3.org/2000/svg', tag);
  for (const arg in args) {
    element.setAttributeNS(null, arg, args[arg]);
  }
  return element;
}


export function getDataset(elem) {
  if ('dataset' in elem) {
    return elem.dataset;
  }
  const dataset = {};
  for (let i = 0; i < elem.attributes.length; i++) {
    const split = elem.attributes[i].name.split('-');
    if (split.shift() === 'data') {
      const join = split.join('-');
      const camelJoin = join.replace(/-(.)/g, (match, group) => group.toUpperCase());
      dataset[camelJoin] = elem.getAttribute(`data-${join}`);
    }
  }
  return dataset;
}


/**
 * Set an element's CSS style.
 * @param {Element} elem      The element to style.
 * @param {Object}  [args={}] The CSS rules.
 */
export function setStyle(elem, args = {}) {
  const element = elem;
  for (const arg in args) {
    element.style[arg] = args[arg];
  }
}


/**
 * Determines whether the element has the given class name.
 * @param  {Element} element   The target element.
 * @param  {string}  className The class name to search.
 * @return {boolean}
 */
export function hasClass(element, className) {
  return element.classList.contains(className);
}


/**
 * Adds a class to an element.
 * @param {Element} element   The target element.
 * @param {string}  className The class name to add.
 */
export function addClass(element, className) {
  element.classList.add(className);
}


/**
 * Removes a class from an element.
 * @param {Element} element   The target element.
 * @param {string}  className The class name to remove.
 */
export function removeClass(element, className) {
  element.classList.remove(className);
}


/**
 * Toggles a class from an element.
 * @param {Element} element   The target element.
 * @param {string}  className The class name to toggle.
 */
export function toggleClass(element, className) {
  element.classList.toggle(className);
}
