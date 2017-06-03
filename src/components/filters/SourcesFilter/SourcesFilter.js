/* eslint-disable no-extra-boolean-cast */

import React  from 'react';
import PropTypes from 'prop-types';
import { Button, Divider, List, Segment } from 'semantic-ui-react';
import map from 'lodash/map';
import noop from 'lodash/noop';

export default class SourceFilter extends React.Component {

  state = {
    selection: [],
  };

  componentDidUpdate = (prevProps, prevState) => {
    this.listContainer.scrollLeft = this.listContainer.scrollWidth;
  }

  onSelectionChange = (event, data) => {
    const { value } = data;
    const depth = data['data-depth']
    this.setState((prevState) => {
      const { selection } = prevState;
      selection.splice(depth, selection.length - depth);
      selection.push(value);
      return { ...prevState, selection };
    });
  };

  onCancel = () => {
    this.setState({ selection: [] });
    this.props.onCancel();
  }

  // Return all lists of selected sources.
  createLists = (depth, sources, selection) => {
    if (!sources || Object.keys(sources).length === 0) {
      return [];
    }
    if (selection.length > 0) {
      const selected = selection[0];
      return [this.createList(depth, sources, selected)].concat(
        this.createLists(depth + 1, sources[selected].children, selection.slice(1)));
    }

    return [this.createList(depth, sources, '')];
  }

  createList = (depth, sources, selected) => (
    <div
      key={selected}
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
          map(sources, (v, k) => (
            <List.Item
              active={selected === k}
              onClick={this.onSelectionChange}
              key={k}
              data-depth={depth}
              value={k}
            >
              {v.name}
            </List.Item>
          ))
        }
      </List>
    </div>
  );

  render() {
    const { onApply } = this.props;
    return (
      <Segment basic attached="bottom" className="tab active" clearing>
        <div
          // eslint-disable-next-line no-return-assign
          ref={el => this.listContainer = el}
          style={{ overflowY: 'hidden', overflowX: 'scroll', width: '100%' }}
        >
          <div style={{ whiteSpace: 'nowrap', width: '100%' }}>
            {
              !!this.props.sources ?
              this.createLists(0, this.props.sources, this.state.selection).map(l => l) :
              'Loading...'
            }
          </div>
        </div>
        <Divider />
        <div>
          <Button floated="right" onClick={onApply} primary>Apply</Button>
          <Button floated="right" onClick={this.onCancel}>Cancel</Button>
        </div>
      </Segment>
    );
  }
}
