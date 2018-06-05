import React from 'react';
import PropTypes from 'prop-types';

import HierarchicalFilter from './HierarchicalFilter';

class SourcesFilter extends React.Component {
  static propTypes = {
    fromYear: PropTypes.number,
    toYear: PropTypes.number,
  };

  static defaultProps = {
    fromYear: 1995,
    toYear: (new Date()).getFullYear(),
  };

  render() {

    return <HierarchicalFilter {...this.props} />;
  }
}

export default SourcesFilter;
