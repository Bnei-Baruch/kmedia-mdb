import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { selectors } from '../../../redux/modules/sources';
import HierarchicalFilter from './HierarchicalFilter';

const dummyTree = [{
  text: 'level 1 - root',
  value: '1',
  count: 50,
  children: [
    {
      text: 'level 2 - 1',
      value: '2',
      count: 10,
      children: [
        {
          text: 'level 3 - 1|1',
          value: '5',
          count: 8,
        },
        {
          text: 'level 3 - 1|2',
          value: '6',
          count: 2,
        },
      ]
    },
    {
      text: 'level 2 - 2',
      value: '3',
      count: 15,
      children: [
        {
          text: 'level 3 - 2|1',
          value: '7',
          count: 4,
        },
        {
          text: 'level 3 - 2|2',
          value: '8',
          count: 11,
        },
      ]
    },
    {
      text: 'level 2 - 3',
      value: '4',
      count: 25,
      children: [
        {
          text: 'level 3 - 3|1',
          value: '9',
          count: 14,
        },
        {
          text: 'level 3 - 3|2',
          value: '10',
          count: 6,
        },
        {
          text: 'level 3 - 3|3',
          value: '11',
          count: 5,
        },
      ]
    }
  ]
}];

class SourcesFilter extends Component {
  static propTypes = {
    roots: PropTypes.array,
    getSourceById: PropTypes.func.isRequired,
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
    const { roots, getSourceById } = props;
    return [
      {
        value: 'root',
        text: 'All Sources',
        count: 123456,
        children: roots ? roots.map(x => this.buildNode(x, getSourceById)) : null,
      }
    ];
  };

  buildNode = (id, getSourceById) => {
    const { name, children } = getSourceById(id);
    return {
      value: id,
      text: name,
      count: 0,
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
