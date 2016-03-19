export function create(tag, args = {}) {
  const element = document.createElement(tag);
  for (const arg in args) {
    element.setAttribute(arg, args[arg]);
  }
  return element;
}

export function createSvg(tag, args = {}) {
  const element = document.createElementNS('http://www.w3.org/2000/svg', tag);
  for (const arg in args) {
    element.setAttributeNS(null, arg, args[arg]);
  }
  return element;
}

export function setStyle(elem, args = {}) {
  const element = elem;
  for (const arg in args) {
    element.style[arg] = args[arg];
  }
}
