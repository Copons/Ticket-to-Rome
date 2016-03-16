export function create(tag, className, args = {}) {
  const element = document.createElement(tag);
  element.classList.add(className);
  for (const arg in args) {
    element.setAttribute(arg, args[arg]);
  }
  return element;
}
