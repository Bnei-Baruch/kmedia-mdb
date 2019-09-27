import React from 'react';
import PropTypes from 'prop-types';
import range from 'lodash/range';

import FlatListFilter from './FlatListFilter';

const YearsFilter = (props) => {
  const { fromYear, toYear, ...rest } = props;

  const options = range(toYear, fromYear, -1).map(x => ({
    value: x,
    text: `${x}`
  }));

  return <FlatListFilter name="years-filter" options={options} {...rest} />;
}

YearsFilter.propTypes = {
  fromYear: PropTypes.number,
  toYear: PropTypes.number,
};

YearsFilter.defaultProps = {
  fromYear: 1995,
  toYear: (new Date()).getFullYear(),
};

export default YearsFilter;
