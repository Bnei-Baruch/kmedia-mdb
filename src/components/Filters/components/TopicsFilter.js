import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { TOPICS_FOR_DISPLAY } from '../../../helpers/consts';
import { selectors } from '../../../redux/modules/tags';
import HierarchicalFilter from './HierarchicalFilter';

class TagsFilter extends Component {
  static propTypes = {
    roots: PropTypes.array,
    getTagById: PropTypes.func.isRequired,
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
      this.props.getTagById !== nextProps.getTagById) {
      this.setState({ tree: this.getTree(nextProps) });
    }
  }

  getTree = (props) => {
    const { roots, getTagById, t } = props;
    return [
      {
        value: 'root',
        text: t('filters.topics-filter.all'),
        // count: 1234,
        children: roots ?
          roots
            .filter(x => TOPICS_FOR_DISPLAY.indexOf(x) !== -1)
            .map(x => this.buildNode(x, getTagById)) :
          null,
      }
    ];
  };

  buildNode = (id, getTagById) => {
    const { label, children } = getTagById(id);
    return {
      value: id,
      text: label,
      // count: 0,
      children: children ? children.map(x => this.buildNode(x, getTagById)) : null,
    };
  };

  render() {
    const { tree } = this.state;
    return <HierarchicalFilter name="topics-filter" tree={tree} {...this.props} />;
  }
}

export default connect(
  state => ({
    roots: selectors.getRoots(state.tags),
    getTagById: selectors.getTagById(state.tags),
  })
)(TagsFilter);
