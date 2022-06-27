import React from 'react';
import moment from 'moment';

import 'react-day-picker/lib/style.css';
import { today } from '../../../../helpers/date';

export const TODAY        = 'TODAY';
export const YESTERDAY    = 'YESTERDAY';
export const LAST_7_DAYS  = 'LAST_7_DAYS';
export const LAST_30_DAYS = 'LAST_30_DAYS';
export const CUSTOM_RANGE = 'CUSTOM_RANGE';
export const CUSTOM_DAY   = 'CUSTOM_DAY';

export const datePresets = [
  TODAY,
  LAST_7_DAYS,
  LAST_30_DAYS
];

export const presetToRange = {
  [TODAY]: () => {
    const nToday = today().toDate();
    return ({ from: nToday, to: nToday });
  },
  [LAST_7_DAYS]: () => ({
    from: today().subtract(6, 'days').toDate(),
    to: today().toDate()
  }),
  [LAST_30_DAYS]: () => ({
    from: today().subtract(29, 'days').toDate(),
    to: today().toDate()
  })
};

export const rangeToPreset = (from, to) => {
  const mFrom = moment(from);
  const mTo   = moment(to);
  const mNow  = today();

  if (mFrom.isSame(mTo, 'day')) {
    if (mTo.isSame(mNow, 'day')) {
      return TODAY;
    }

    if (mTo.isSame(moment(mNow).subtract(1, 'days'), 'day')) {
      return YESTERDAY;
    }
  } else if (moment(mTo).subtract(6, 'days').isSame(mFrom, 'day')) {
    return LAST_7_DAYS;
  } else if (moment(mTo).subtract(29, 'days').isSame(mFrom, 'day') && mTo.isSame(mNow, 'day')) {
    return LAST_30_DAYS;
  }

  if (mFrom.isSame(mTo, 'day')) {
    return CUSTOM_DAY;
  }

  return CUSTOM_RANGE;
};

export const isValidDateRange = (from, to) => {
  const mFrom = moment(from);
  const mTo   = moment(to);

  return mFrom.isValid()
    && mTo.isValid()
    && mFrom.isSameOrBefore(mTo, 'day')
    && mTo.isSameOrBefore(today(), 'day');
};
