import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { isEmpty } from '../../../helpers/utils';
import { selectors } from '../../../redux/modules/sources';
import { selectors as stats } from '../../../redux/modules/stats';
import HierarchicalFilter from './HierarchicalFilter';

class SourcesFilter extends Component {
  static propTypes = {
    roots: PropTypes.array,
    getSourceById: PropTypes.func.isRequired,
    cuStats: PropTypes.objectOf(PropTypes.number),
    t: PropTypes.func.isRequired,
  };

  static defaultProps = {
    roots: [],
    cuStats: {},
  };

  constructor(props) {
    super(props);
    this.state = { tree: this.getTree(this.props) };
  }

  componentWillReceiveProps(nextProps) {
    if ((this.props.roots !== nextProps.roots &&
      this.props.getSourceById !== nextProps.getSourceById) ||
      this.props.cuStats !== nextProps.cuStats) {
      this.setState({ tree: this.getTree(nextProps) });
    }
  }

  getTree = (props) => {
    const { roots, getSourceById, cuStats, t } = props;

    const root = {
      value: 'root',
      text: t('filters.sources-filter.all'),
      children: roots ? roots.map(x => this.buildNode(x, getSourceById, cuStats)) : null,
    };

    return [root];
  };

  buildNode = (id, getSourceById, cuStats) => {
    const { name, children } = getSourceById(id);
    return {
      value: id,
      text: name,
      count: cuStats[id] || 0,
      children: children ? children.map(x => this.buildNode(x, getSourceById, cuStats)) : null,
    };
  };

  render() {
    const { tree } = this.state;
    return <HierarchicalFilter name="sources-filter" tree={tree} {...this.props} />;
  }
}

export default connect(
  (state, ownProps) => {
    let cuStats = stats.getCUStats(state.stats, ownProps.namespace) || { data: { sources: {} } };
    cuStats     = isEmpty(cuStats) || isEmpty(cuStats.data) ? {} : cuStats.data.sources;

    return {
      roots: selectors.getRoots(state.sources),
      getSourceById: selectors.getSourceById(state.sources),
      cuStats,
    };
  }
)(SourcesFilter);
