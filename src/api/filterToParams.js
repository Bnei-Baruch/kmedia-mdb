import moment from 'moment';

const filtersToParams = {
  'date-filter': (value) => {
    const { from, to } = value;
    return {
      start_date: moment(new Date(from)).format('YYYY-MM-DD'),
      end_date: moment(new Date(to)).format('YYYY-MM-DD')
    };
  },
  'sources-filter': value => ({ [value.length === 1 ? 'author' : 'source']: value[value.length - 1] }),
  'topics-filter': value => ({ 'tag': value }),
};

const filterToParams = name => (values) => {
  const transform = filtersToParams[name];
  if (!transform) {
    return { [name]: values };
  }

  const transformedValues = Array.isArray(values)
    ? values.map(value => transform(value))
    : transform(values);

  if (Array.isArray(transformedValues)) {
    return transformedValues.reduce((acc, param) => {
      Object.keys(param).forEach((key) => {
        const value = param[key];
        if (Array.isArray(acc[key])) {
          acc[key].push(value);
        } else {
          acc[key] = [value];
        }
      });
      return acc;
    }, {});
  }

  return transformedValues;
};

export default filterToParams;
