/**
 * Generates a random number between min and max (inclusive)
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Random number in range
 */
export const random = (min, max) => Math.random() * (max - min) + min;

/**
 * Generates a random integer between min and max (inclusive)
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Random integer in range
 */
export const randomInt = (min, max) => Math.floor(random(min, max + 1));
