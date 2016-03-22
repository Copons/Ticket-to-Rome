/**
 * Create a HTML element.
 * @param  {string} tag - The element tag name.
 * @param  {Object} [args={}] - The element attributes.
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
 * @param  {string} tag - The element tag name.
 * @param  {Object} [args={}] - The element attributes.
 * @return {Element}
 */
export function createSvg(tag, args = {}) {
  const element = document.createElementNS('http://www.w3.org/2000/svg', tag);
  for (const arg in args) {
    element.setAttributeNS(null, arg, args[arg]);
  }
  return element;
}


/**
 * Set an element's CSS style.
 * @param {Element} elem - The element to style.
 * @param {Object} [args={}] - The CSS rules.
 */
export function setStyle(elem, args = {}) {
  const element = elem;
  for (const arg in args) {
    element.style[arg] = args[arg];
  }
}
