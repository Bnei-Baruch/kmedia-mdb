/**
 * Prints a localized from-to date string, i.e., [25-27 of August 2017], [25-27 Августа 2017], [25-27 לאוגוסט 2017]
 * @param {!moment} from
 * @param {!moment} to
 * @return {string}
 */
export function fromToLocalized(from, to) {
  const toStr     = to.format('DD MMMM YYYY');
  const SEPARATOR = ' - ';
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
 * use this function to create new Date and convert string date into Date
 * to avoid timezone differences
 *
 * @param {*} stringDate
 */
export function createDate(stringDate) {
  const date = Date.parse(stringDate) ? new Date(`${stringDate} GMT `) : new Date();

  // remove the local timezone offset
  date.setTime(date.getTime() + (date.getTimezoneOffset() * 60 * 1000));
  return date;
}

/**
 * Compares two dates, returns true is both defined and are the same date.
 * @param {Date} a
 * @param {Date} b
 * @return {boolean}
 */
export function sameDate(a, b) {
  if (!a || !b) {
    return false;
  }

  return a.getYear() === b.getYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
