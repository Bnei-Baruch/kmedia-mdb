import 'moment-duration-format';

// Compare two items
const compare = (item1, item2) => {
  // Get the object type
  const itemType = Object.prototype.toString.call(item1);

  // If an object or array, compare recursively
  if (['[object Array]', '[object Object]'].indexOf(itemType) >= 0) {
    return (this.isEqual(item1, item2));
  }

  // If the two items are not the same type, return false
  if (itemType !== Object.prototype.toString.call(item2)) {
    return false;
  }

  // Else if it's a function, convert to a string and compare
  // Otherwise, just compare
  if (itemType === '[object Function]') {
    return item1.toString() === item2.toString();
  }

  return item1 === item2;
};

const compareOwnProperties = (value, other) => {
  const values = Object.values(value);
  const others = Object.values(other);

  for (let key = 0; key < values.length; key++) {
    if (compare(value[key], others[key]) === false) {
      return false;
    }
  }

  return true;
};

const compareArrays = (value, other, valueLen) => {
  for (let i = 0; i < valueLen; i++) {
    if (compare(value[i], other[i]) === false) {
      return false;
    }
  }
  return true;
};

const compareProperties = (value, other, valueLen, type) => (
  type === '[object Array]' ?
    compareOwnProperties(value, other) :
    compareArrays(value, other, valueLen)
);

export const isEqual = (value, other) => {
  // Get the value type
  const type = Object.prototype.toString.call(value);

  // If the two objects are not the same type, return false
  if (type !== Object.prototype.toString.call(other)) {
    return false;
  }

  // If items are not an object or array, return false
  if (['[object Array]', '[object Object]'].indexOf(type) < 0) {
    return false;
  }

  // Compare the length of the length of the two items
  const valueLen = type === '[object Array]' ? value.length : Object.keys(value).length;
  const otherLen = type === '[object Array]' ? other.length : Object.keys(other).length;
  if (valueLen !== otherLen) {
    return false;
  }

  return compareProperties(value, other, valueLen, type);
};
