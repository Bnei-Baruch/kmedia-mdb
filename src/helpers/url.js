import qs from 'qs';

export function parse(str) {
  return qs.parse(str);
}

export function stringify(obj) {
  return qs.stringify(obj, { arrayFormat: 'repeat', skipNulls: true });
}
