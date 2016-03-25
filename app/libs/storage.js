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
