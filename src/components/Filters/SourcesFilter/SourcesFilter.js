/* eslint-disable no-extra-boolean-cast */

import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, Divider, List, Segment } from 'semantic-ui-react';
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
      <div
        key={selectedId}
        style={{
          width: '33%',
          paddingRight: '15px',
          height: '250px',
          display: 'inline-block',
          overflowY: 'scroll'
        }}
      >
        <List divided relaxed selection>
          {
            items.map((x) => {
              const node = getSourceById(x);
              return (
                <List.Item
                  key={x}
                  value={x}
                  active={selectedId === x}
                  data-depth={depth}
                  onClick={this.onSelectionChange}
                >
                  {node.name}
                </List.Item>
              );
            })
          }
        </List>
      </div>
    );
  };

  render() {
    const { roots } = this.props;

    return (
      <Segment basic attached="bottom" className="tab active" clearing>
        <div
          // eslint-disable-next-line no-return-assign
          ref={el => this.listContainer = el}
          style={{ overflowY: 'hidden', overflowX: 'scroll', width: '100%' }}
        >
          <div style={{ whiteSpace: 'nowrap', width: '100%' }}>
            {
              roots.length > 0 ?
                this.createLists(0, roots, this.state.selection).map(l => l) :
                'No Sources'
            }
          </div>
        </div>
        <Divider />
        <div>
          <Button floated="right" onClick={this.apply} primary>Apply</Button>
          <Button floated="right" onClick={this.onCancel}>Cancel</Button>
        </div>
      </Segment>
    );
  }
}

export default connect(
  state => ({
    roots: sources.getRoots(state.sources),
    getSourceById: sources.getSourceById(state.sources),
  })
)(connectFilter({ isMultiple: true })(SourcesFilter));
