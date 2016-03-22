/**
 * Calculate a random integer.
 * @param  {number} limit - The maximum random number.
 * @return {number} The random number.
 */
export function random (limit) {
  return Math.floor(Math.random() * limit);
}
