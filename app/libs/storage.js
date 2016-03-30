/**
 * Set a session item.
 * @param {string} key   The session item name.
 * @param {string} value The session item content.
 */
export function sessionSet(key, value) {
  sessionStorage.setItem(key, JSON.stringify(value));
}


/**
 * Get a session item.
 * @param {string} key The session item name.
 */
export function sessionGet(key) {
  return JSON.parse(sessionStorage.getItem(key));
}


/**
 * Delete a session item.
 * @param {string} key The session item name.
 */
export function sessionRemove(key) {
  sessionStorage.removeItem(key);
}


/**
 * Set a local storage item.
 * @param {string} key   The local storage item name.
 * @param {string} value The local storage item content.
 */
export function localStorageSet(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}


/**
 * Get a local storage item.
 * @param {string} key The local storage item name.
 */
export function localStorageGet(key) {
  return JSON.parse(localStorage.getItem(key));
}


/**
 * Delete a local storage item.
 * @param {string} key The local storage item name.
 */
export function localStorageRemove(key) {
  localStorage.removeItem(key);
}
