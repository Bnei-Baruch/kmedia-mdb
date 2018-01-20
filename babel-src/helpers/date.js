'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fromToLocalized = fromToLocalized;
exports.sameDate = sameDate;
/**
 * Prints a localized from-to date string, i.e., [25-27 of August 2017], [25-27 Августа 2017], [25-27 לאוגוסט 2017]
 * @param {!moment} from
 * @param {!moment} to
 * @return {string}
 */
function fromToLocalized(from, to) {
  var toStr = to.format('DD MMMM YYYY');
  var SEPARATOR = ' - ';
  if (from.year() !== to.year()) {
    return from.format('DD MMMM YYYY') + SEPARATOR + toStr;
  } else if (from.month() !== to.month()) {
    return from.format('DD MMMM') + SEPARATOR + toStr;
  } else if (from.date() !== to.date()) {
    return from.format('DD') + SEPARATOR + toStr;
  }
  return toStr;
}

/**
 * Compares two dates, returns true is both defined and are the same date.
 * @param {Date} a
 * @param {Date} b
 * @return {boolean}
 */
function sameDate(a, b) {
  if (!a || !b) {
    return false;
  }

  return a.getYear() === b.getYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}