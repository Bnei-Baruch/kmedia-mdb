import React from 'react';
import PropTypes from 'prop-types';
import range from 'lodash/range';

import FlatListFilter from './FlatListFilter';

class YearsFilter extends React.Component {
  static propTypes = {
    fromYear: PropTypes.number,
    toYear: PropTypes.number,
  };

  static defaultProps = {
    fromYear: 1995,
    toYear: (new Date()).getFullYear(),
  };

  render() {
    const { fromYear, toYear, ...rest } = this.props;

    const options = range(toYear, fromYear, -1).map(x => ({
      value: x,
      text: `${x}`
    }));

    return <FlatListFilter options={options} {...rest} />;
  }
}

export default YearsFilter;
