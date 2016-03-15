export const appContainer = document.querySelector('#ttr');

export function select (selector) {
  return document.querySelector(selector);
}

export function append (container, child) {
  container.insertAdjacentHTML('beforeend', child);
}

export function create (tag, id) {
  const element = document.createElement(tag);
  element.setAttribute('id', id);
  return element;
}
