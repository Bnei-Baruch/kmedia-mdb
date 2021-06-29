import moment from 'moment';

import { DATE_FORMAT } from '../../helpers/consts';
import { createFilterDefinition } from './util';

const dateFilter = {
  name: 'date-filter',
  queryKey: 'dates',
  valueToQuery: value => {
    if (!value) {
      return null;
    }

    const { from, to } = value;
    return `${moment(from).format(DATE_FORMAT)}_${moment(to).format(DATE_FORMAT)}`;
  },
  queryToValue: queryValue => {
    const parts = queryValue.split('_');

    return {
      from: moment(parts[0], DATE_FORMAT).toDate(),
      to: moment(parts[1], DATE_FORMAT).toDate()
    };
  },
  valueToApiParam: value => {
    const { from, to } = value;
    return {
      start_date: moment(from).format(DATE_FORMAT),
      end_date: moment(to).format(DATE_FORMAT)
    };
  },
  valueToTagLabel: value => {
    if (!value) {
      return '';
    }

    const { from, to } = value;
    const mFrom        = moment(from);
    const mTo          = moment(to);

    if (mFrom.isSame(mTo, 'day')) {
      return mFrom.format('D MMM YYYY');
    }

    return `${mFrom.format('D MMM YYYY')} - ${mTo.format('D MMM YYYY')}`;
  }
};

export default createFilterDefinition(dateFilter);
