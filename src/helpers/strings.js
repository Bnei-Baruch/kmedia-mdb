/**
 * Simple string truncation at last word and ellipsis.
 *
 * Note: *does not* support html markup
 * Once we need such functionality check out these links:
 * https://github.com/glinford/ellipsis.js
 * https://gist.github.com/cbosco/4339f6d842c6c9ac35f21982e98b4412
 *
 * @param str {string} sentence to truncate
 * @param len {int} max amount of chars
 * @returns {string}
 */
export function ellipsize(str, len = 200) {
  if (!str) {
    return '';
  }

  return (str.length > len)
    ? `${str.substr(0, str.lastIndexOf(' ', len))}...`
    : str;
}
