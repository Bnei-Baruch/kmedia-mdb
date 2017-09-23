import moment from 'moment';

import { DATE_FORMAT } from '../../helpers/consts';
import { sameDate } from '../../helpers/date';
import { createFilterDefinition } from './util';

const dateFilter = {
  name: 'date-filter',
  queryKey: 'dates',
  valueToQuery: (value) => {
    if (!value) {
      return null;
    }

    return `${moment(value.from).format(DATE_FORMAT)}_${moment(value.to).format(DATE_FORMAT)}`;
  },
  queryToValue: (queryValue) => {
    const parts = queryValue.split('_');

    return {
      from: moment(parts[0], DATE_FORMAT).toDate(),
      to: moment(parts[1], DATE_FORMAT).toDate()
    };
  },
  valueToApiParam: (value) => {
    const { from, to } = value;
    return {
      start_date: moment(new Date(from)).format(DATE_FORMAT),
      end_date: moment(new Date(to)).format(DATE_FORMAT)
    };
  },
  tagIcon: 'calendar',
  valueToTagLabel: (value) => {
    if (!value) {
      return '';
    }

    const { from, to } = value;
    const dateFormat   = date => moment(new Date(date)).format('D MMM YYYY');

    if (sameDate(value.from, value.to)) {
      return dateFormat(from);
    }

    return `${dateFormat(from)} - ${dateFormat(to)}`;
  }
};

export default createFilterDefinition(dateFilter);
