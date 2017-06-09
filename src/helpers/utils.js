import identity from 'lodash/identity';

export const isEmpty = (obj) => {
  // null and undefined are "empty"
  if (obj === null) {
    return true;
  }

  // Assume if it has a length property with a non-zero value
  // that that property is correct.
  if (obj.length > 0) {
    return false;
  }
  if (obj.length === 0) {
    return true;
  }

  // If it isn't an object at this point
  // it is empty, but it can't be anything *but* empty
  // Is it empty?  Depends on your application.
  if (typeof obj !== 'object') {
    return true;
  }

  return Object.getOwnPropertyNames(obj).length <= 0;
};

/**
 * Creates a function the recieves key and value and transforms the value depending on the object map.
 * The object can have a '__default' key that acts as the default case in switch.
 *
 * @param {Object} mapperObj a map object from key to value
 * @param {Function} [defaultTransform=identity] the default transform to use incase the key is missing in mapperObj and there is no __default key
 * @example
 * const mapperObj = {
 *   key1: (value) => value.join(','),
 *   __default: (value) => value.toString()
 * }
 *
 * const mapper = createMapper(mapperObj);
 * const transformedValue = mapper('key1', ['value1', 'value2'])
 */
export const createMapper = (mapperObj, defaultTransform = identity) => (key, value) => {
  // eslint-disable-next-line no-underscore-dangle
  const transform = mapperObj[key] || mapperObj.__default;
  if (transform) {
    return transform(value, key);
  }

  return defaultTransform(value, key);
};
