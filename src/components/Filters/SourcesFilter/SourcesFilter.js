/* eslint-disable no-extra-boolean-cast */

import React  from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, Divider, List, Segment } from 'semantic-ui-react';
import map from 'lodash/map';
import noop from 'lodash/noop';
import { selectors as filterSelectors, actions as filterActions } from '../../../redux/modules/filters';
// Remove this when move to redux
import dataLoader from '../dataLoader';

const filterName = 'sources-filter';

class SourcesFilter extends React.Component {
  componentDidUpdate = () => {
    this.listContainer.scrollLeft = this.listContainer.scrollWidth;
  }

  onSelectionChange = (event, data) => {
    const { value } = data;
    const depth = data['data-depth'];

    const { selection: oldSelection } = this.props;
    const newSelection = [...oldSelection];
    newSelection.splice(depth, oldSelection.length - depth);
    newSelection.push(value);
    this.props.setFilterValue(this.props.namespace, filterName, newSelection);
  };

  onCancel = () => {
    this.props.setFilterValue(this.props.namespace, filterName, []);
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
              this.createLists(0, this.props.sources, this.props.selection).map(l => l) :
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

const SourceShape = {
  name: PropTypes.string.isRequired,
  children: PropTypes.objectOf(PropTypes.shape)
};
const SourcesType = PropTypes.objectOf(PropTypes.shape(SourceShape));
SourceShape.children = SourcesType;

SourcesFilter.propTypes = {
  namespace: PropTypes.string.isRequired,
  sources: SourcesType,
  onCancel: PropTypes.func,
  onApply: PropTypes.func,
  selection: PropTypes.arrayOf(PropTypes.string),
  setFilterValue: PropTypes.func.isRequired
};

SourcesFilter.defaultProps = {
  sources: null,
  onCancel: noop,
  onApply: noop,
  selection: []
};

const ConnectedSourcesFilter = connect(
  (state, ownProps) => ({
    selection: filterSelectors.getFilterValue(state.filters, ownProps.namespace, filterName)
  }),
  filterActions
)(SourcesFilter);

const buildSources = (json) => {
  if (!json) {
    return {};
  }

  const sources = json.reduce((acc, s) => {
    const codeOrId = s.code || s.id;
    acc[codeOrId] = { name: s.name, children: buildSources(s.children) };
    return acc;
  }, {});
  return sources;
};

export default dataLoader(() =>
  fetch('http://rt-dev.kbb1.com:8080/hierarchy/sources/')
    .then(response => response.json())
    .then(json => ({ sources: buildSources(json) }))
)(ConnectedSourcesFilter);

