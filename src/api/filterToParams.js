import moment from 'moment';

const filtersToParams = {
  'date-filter': (value) => {
    const { from, to } = value;
    return {
      start_date: moment(new Date(from)).format('YYYY-MM-DD'),
      end_date: moment(new Date(to)).format('YYYY-MM-DD')
    };
  }
};

const filterToParams = name => (value) => {
  const transform = filtersToParams[name];
  if (!transform) {
    return value;
  }

  return transform(value);
};

export default filterToParams;
