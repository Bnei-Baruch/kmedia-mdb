import moment from 'moment';

const filtersToParams = {
  'date-filter': (value) => {
    const { from, to } = value;
    return {
      start_date: moment(new Date(from)).format('DD-MM-YYYY'),
      end_date: moment(new Date(to)).format('DD-MM-YYYY')
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
