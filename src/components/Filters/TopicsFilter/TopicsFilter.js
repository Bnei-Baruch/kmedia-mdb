import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, Divider, List, Segment } from 'semantic-ui-react';
import noop from 'lodash/noop';

import { TAG_ROOT_TOPICS } from '../../../helpers/consts';
import { actions as filterActions, selectors as filterSelectors } from '../../../redux/modules/filters';
import { selectors as tags } from '../../../redux/modules/tags';

const filterName  = 'topics-filter';

class TopicsFilter extends React.Component {

  state = {
    selection: this.props.lastSelection
  };

  onSelectionChange = (event, data) => {
    const { value } = data;
    this.setState({ selection: value });
  };

  onCancel = () => {
    this.props.onCancel();
  };

  apply = () => {
    this.props.addFilterValue(this.props.namespace, filterName, this.state.selection);
    this.props.onApply();
  };

  createList = (items, selected) => {
    if (!Array.isArray(items)) {
      return null;
    }

    const getTagById = this.props.getTagById;

    return (
      <div
        style={{
          height: '250px',
          overflowY: 'scroll'
        }}
      >
        <List divided relaxed selection>
          {
            items.map((x) => {
              const node = getTagById(x);
              return (
                <List.Item
                  active={selected === node.id}
                  onClick={this.onSelectionChange}
                  key={node.id}
                  value={node.id}
                >
                  {node.label}
                </List.Item>
              );
            })
          }
        </List>
      </div>
    );
  };

  render() {
    const topics = this.props.getTagById(TAG_ROOT_TOPICS);

    return (
      <Segment basic attached="bottom" className="tab active" clearing>
        {
          topics.children ?
            this.createList(topics.children, this.state.selection) :
            'No topics'
        }
        <Divider />
        <div>
          <Button floated="right" onClick={this.apply} primary>Apply</Button>
          <Button floated="right" onClick={this.onCancel}>Cancel</Button>
        </div>
      </Segment>
    );
  }
}

TopicsFilter.propTypes = {
  namespace: PropTypes.string.isRequired,
  onCancel: PropTypes.func,
  onApply: PropTypes.func,
  addFilterValue: PropTypes.func.isRequired,
  lastSelection: PropTypes.string,
  getTagById: PropTypes.func.isRequired,
};

TopicsFilter.defaultProps = {
  onCancel: noop,
  onApply: noop,
  lastSelection: null,
};

export default connect(
  (state, ownProps) => ({
    selection: filterSelectors.getLastFilterValue(state.filters, ownProps.namespace, filterName),
    getTagById: tags.getTagById(state.tags),
  }),
  filterActions
)(TopicsFilter);
