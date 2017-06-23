/* eslint-disable no-extra-boolean-cast */

import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, Divider, List, Segment, Menu } from 'semantic-ui-react';
import noop from 'lodash/noop';
import { selectors as sources } from '../../../redux/modules/sources';
import connectFilter from '../connectFilter';

class SourcesFilter extends React.Component {

  static propTypes = {
    roots: PropTypes.arrayOf(PropTypes.string),
    getSourceById: PropTypes.func.isRequired,
    onCancel: PropTypes.func,
    onApply: PropTypes.func,
    updateValue: PropTypes.func.isRequired,
    value: PropTypes.arrayOf(PropTypes.string)
  };

  static defaultProps = {
    roots: [],
    onCancel: noop,
    onApply: noop,
    value: []
  };

  state = {
    selection: this.props.value
  };

  componentWillReceiveProps(nextProps) {
    this.setState({
      selection: nextProps.value
    });
  }

  componentDidUpdate = () => {
    this.listContainer.scrollLeft = this.listContainer.scrollWidth;
  };

  onSelectionChange = (event, data) => {
    const { value } = data;
    const depth     = data['data-depth'];

    const { selection: oldSelection } = this.state;
    const newSelection                = [...oldSelection];
    newSelection.splice(depth, oldSelection.length - depth);
    newSelection.push(value);
    this.setState({ selection: newSelection });
  };

  onCancel = () => {
    this.props.onCancel();
  };

  apply = () => {
    this.props.updateValue(this.state.selection);
    this.props.onApply();
  };

  // Return all lists of selected sources.
  createLists = (depth, items, selection) => {
    if (!Array.isArray(items) || items.length === 0) {
      return [];
    }

    if (selection.length === 0) {
      return [this.createList(depth, items, '')];
    }

    const selected = this.props.getSourceById(selection[0]);
    const current  = this.createList(depth, items, selection[0]);
    let next       = [];
    if (selected && selected.children) {
      next = this.createLists(depth + 1, selected.children, selection.slice(1));
    }

    return [current].concat(next);
  };

  createList = (depth, items, selectedId) => {
    const { getSourceById } = this.props;
    return (
      <div className="filter-steps__column-wrapper"
        key={selectedId}
      >
        <div className="filter-steps__column">
          <Menu pointing vertical compact color='blue' size='tiny'>
            {
              items.map((x) => {
                const node = getSourceById(x);
                return (
                  <Menu.Item
                    key={x}
                    value={x}
                    active={selectedId === x}
                    data-depth={depth}
                    onClick={this.onSelectionChange}
                  >
                    {node.name}
                  </Menu.Item>
                );
              })
            }
          </Menu>
        </div>
      </div>
    );
  };

  render() {
    const { roots } = this.props;

    return (
      <div  style={{}}>
      
        <Segment vertical  className="tab active" style={{
          padding:'0'
        }}>
          <div className="filter-steps"
            // eslint-disable-next-line no-return-assign
            ref={el => this.listContainer = el}
            style={{  }}
          >
            {/*<div style={{  }}>*/}
              {
                roots.length > 0 ?
                  this.createLists(0, roots, this.state.selection).map(l => l) :
                  'No Sources'
              }
           {/* </div> )*/}
          </div>
        
        </Segment>
        <Segment vertical clearing>
          <Button floated="right" onClick={this.apply} primary>Apply</Button>
          <Button floated="right" onClick={this.onCancel}>Cancel</Button>
        </Segment>
      </div>
    );
  }
}

export default connect(
  state => ({
    roots: sources.getRoots(state.sources),
    getSourceById: sources.getSourceById(state.sources),
  })
)(connectFilter({ isMultiple: true })(SourcesFilter));
