export function sessionSet(key, value) {
  sessionStorage.setItem(key, JSON.stringify(value));
}

export function sessionGet(key) {
  return JSON.parse(sessionStorage.getItem(key));
}

export function sessionRemove(key) {
  sessionStorage.removeItem(key);
}
