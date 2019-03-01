import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import { connect } from 'react-redux';

import { TOPICS_FOR_DISPLAY } from '../../../helpers/consts';
import { isEmpty } from '../../../helpers/utils';
import { selectors } from '../../../redux/modules/tags';
import { selectors as stats } from '../../../redux/modules/stats';
import HierarchicalFilter from './HierarchicalFilter';

class TagsFilter extends Component {
  static propTypes = {
    roots: PropTypes.array,
    getTagById: PropTypes.func.isRequired,
    cuStats: PropTypes.objectOf(PropTypes.number),
    t: PropTypes.func.isRequired,
  };

  static defaultProps = {
    roots: [],
    cuStats: null,
  };

  constructor(props) {
    super(props);
    this.state = { tree: this.getTree(this.props) };
  }

  componentWillReceiveProps(nextProps) {
    const { roots, getTagById, cuStats } = this.props;

    if ((roots !== nextProps.roots
      && getTagById !== nextProps.getTagById)
      || cuStats !== nextProps.cuStats) {
      this.setState({ tree: this.getTree(nextProps) });
    }
  }

  getTree = (props) => {
    const { roots, getTagById, cuStats, t } = props;
    return [
      {
        value: 'root',
        text: t('filters.topics-filter.all'),
        children: roots
          ? roots
            .filter(x => TOPICS_FOR_DISPLAY.indexOf(x) !== -1)
            .map(x => this.buildNode(x, getTagById, cuStats))
          : null,
      }
    ];
  };

  buildNode = (id, getTagById, cuStats) => {
    const { label, children } = getTagById(id);
    return {
      value: id,
      text: label,
      count: cuStats ? cuStats[id] : null,
      children: children ? children.map(x => this.buildNode(x, getTagById, cuStats)) : null,
    };
  };

  render() {
    const { tree } = this.state;
    return <HierarchicalFilter name="topics-filter" tree={tree} {...this.props} />;
  }
}

export default connect(
  (state, ownProps) => {
    let cuStats = stats.getCUStats(state.stats, ownProps.namespace) || { data: { tags: {} } };
    cuStats     = isEmpty(cuStats) || isEmpty(cuStats.data) ? null : cuStats.data.tags;

    return {
      roots: selectors.getRoots(state.tags),
      getTagById: selectors.getTagById(state.tags),
      cuStats,
    };
  }
)(withNamespaces()(TagsFilter));
