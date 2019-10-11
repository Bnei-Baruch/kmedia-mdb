import React from 'react';
import PropTypes from 'prop-types';
import range from 'lodash/range';

import FlatListFilter from './FlatListFilter';

const defToYear = (new Date()).getFullYear();

const YearsFilter = (props) => {
  const { fromYear = 1995, toYear = defToYear, ...rest } = props;

  const options = range(toYear, fromYear, -1).map(x => ({
    value: x,
    text: `${x}`
  }));

  return <FlatListFilter name="years-filter" options={options} {...rest} />;
};

YearsFilter.propTypes = {
  fromYear: PropTypes.number,
  toYear: PropTypes.number,
};

export default YearsFilter;
