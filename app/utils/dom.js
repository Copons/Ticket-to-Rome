export function create(tag, className, args = {}) {
  const element = document.createElement(tag);
  element.classList.add(className);
  for (const arg in args) {
    element.setAttribute(arg, args[arg]);
  }
  return element;
}

export function setStyle(elem, args = {}) {
  const element = elem;
  for (const arg in args) {
    element.style[arg] = args[arg];
  }
}

export function correctPosition(percentPosition, size) {
  return `calc(${percentPosition}% - ${size / 2}px)`;
}
