import moment from 'moment/moment';

import { DATE_FORMAT, FN_DATE_FILTER } from '../../../src/helpers/consts';
import { createFilterDefinition } from './util';

const Label = ({ value }) => {
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

};

const dateFilter = {
  name: FN_DATE_FILTER,
  queryKey: 'dates',
  apiKey: 'date',
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
      from: moment(parts[0], DATE_FORMAT).format(DATE_FORMAT),
      to: moment(parts[1], DATE_FORMAT).format(DATE_FORMAT)
    };
  },
  valueToApiParam: value => {
    const { from, to } = value || false;
    return {
      start_date: moment(from).format(DATE_FORMAT),
      end_date: moment(to).format(DATE_FORMAT)
    };
  },
  valueToTagLabel: Label
};

export default createFilterDefinition(dateFilter);
