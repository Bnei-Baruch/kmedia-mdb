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
export const ellipsize = (str, len = 200) => {
  if (!str) {
    return '';
  }

  return (str.length > len)
    ? `${str.substr(0, str.lastIndexOf(' ', len))}...`
    : str;
};

const isCharALetter = char => {
  // this works for all languages that have upper and lower case letters
  // eslint-disable-next-line eqeqeq
  if (char.toLowerCase() != char.toUpperCase())
    return true;

  // check hebrew
  const hebrewChars = new RegExp('^[\u0590-\u05FF]+$');
  return hebrewChars.test(char)

  // we need to add Arabic, Japanese, Chinese etc. when needed
};

// returns first letter of a string
export const getFirstLetter = str => {
  if (!str) {
    return ''
  }

  const specialChars = new RegExp('"/[ `!@#$%^&*()_+-=[]{};\':\\|,.<>/?~]/');

  for (const l of str) {
    if (!specialChars.test(l) && isCharALetter(l)) {
      return l;
    }
  }

  return str[0];
}
