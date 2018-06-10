import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { selectors } from '../../../redux/modules/sources';
import HierarchicalFilter from './HierarchicalFilter';

class SourcesFilter extends Component {
  static propTypes = {
    roots: PropTypes.array,
    getSourceById: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
  };

  static defaultProps = {
    roots: [],
  };

  constructor(props) {
    super(props);
    this.state = { tree: this.getTree(this.props) };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.roots !== nextProps.roots &&
      this.props.getSourceById !== nextProps.getSourceById) {
      this.setState({ tree: this.getTree(nextProps) });
    }
  }

  getTree = (props) => {
    const { roots, getSourceById, t } = props;
    return [
      {
        value: 'root',
        text: t('filters.sources-filter.all'),
        // count: 123456,
        children: roots ? roots.map(x => this.buildNode(x, getSourceById)) : null,
      }
    ];
  };

  buildNode = (id, getSourceById) => {
    const { name, children } = getSourceById(id);
    return {
      value: id,
      text: name,
      // count: 0,
      children: children ? children.map(x => this.buildNode(x, getSourceById)) : null,
    };
  };

  render() {
    const { tree } = this.state;
    return <HierarchicalFilter tree={tree} {...this.props} />;
  }
}

export default connect(
  state => ({
    roots: selectors.getRoots(state.sources),
    getSourceById: selectors.getSourceById(state.sources),
  })
)(SourcesFilter);
