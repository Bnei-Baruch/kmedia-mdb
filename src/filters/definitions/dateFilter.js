import moment from 'moment';
import createFilterDefinition from './createFilterDefinition';

const dateFilter = {
  name: 'date-filter',
  queryKey: 'dates',
  valueToQuery: (value) => {
    if (!value) {
      return null;
    }

    return `${moment(value.from).format('DD-MM-YYYY')}_${moment(value.to).format('DD-MM-YYYY')}`;
  },
  queryToValue: (queryValue) => {
    const parts = queryValue.split('_');

    return {
      from: moment(parts[0], 'DD-MM-YYYY').toDate(),
      to: moment(parts[1], 'DD-MM-YYYY').toDate()
    };
  },
  valueToApiParam: (value) => {
    const { from, to } = value;
    return {
      start_date: moment(new Date(from)).format('YYYY-MM-DD'),
      end_date: moment(new Date(to)).format('YYYY-MM-DD')
    };
  },
  tagIcon: 'calendar',
  valueToTagLabel: (value) => {
    if (!value) {
      return '';
    }

    const { from, to } = value;
    const dateFormat   = date => moment(new Date(date)).format('D MMM YYYY');

    if (value.from === value.to) {
      return dateFormat(from);
    }

    return `${dateFormat(from)} - ${dateFormat(to)}`;
  }
};

export default createFilterDefinition(dateFilter);
