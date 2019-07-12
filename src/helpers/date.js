import moment from 'moment';

import { DATE_FORMAT } from './consts';

/**
 * Prints a localized from-to date string, i.e., [25-27 of August 2017], [25-27 Августа 2017], [25-27 לאוגוסט 2017]
 * @param {moment | string} from
 * @param {moment | string} to
 * @return {string}
 */
export function fromToLocalized(from, to) {
  const mFrom = moment.utc(from, DATE_FORMAT);
  const mTo   = moment.utc(to, DATE_FORMAT);

  const toStr     = mTo.format('DD MMMM YYYY');
  const SEPARATOR = ' - ';

  let fromFormat;
  if (mFrom.year() !== mTo.year()) {
    fromFormat = 'DD MMMM YYYY';
  } else if (mFrom.month() !== mTo.month()) {
    fromFormat = 'DD MMMM';
  } else if (mFrom.date() !== mTo.date()) {
    fromFormat = 'DD';
  }

  return fromFormat ? mFrom.format(fromFormat) + SEPARATOR + toStr : toStr;
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

  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export function today() {
  return moment()
    .hours(0)
    .minutes(0)
    .seconds(0)
    .milliseconds(0);
}

export function yearFromNow() {
  return new Date(Date.now() + (365 * 24 * 60 * 60 * 1000)).toUTCString();
}