import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, Divider, List, Segment } from 'semantic-ui-react';
import noop from 'lodash/noop';

import { selectors as tags } from '../../../redux/modules/tags';
import connectFilter from '../connectFilter';

const TOPICS_ROOT = 'mS7hrYXK';

class TopicsFilter extends React.Component {

  static propTypes = {
    onCancel: PropTypes.func,
    onApply: PropTypes.func,
    updateValue: PropTypes.func.isRequired,
    value: PropTypes.string,
    getTagById: PropTypes.func.isRequired,
  };

  static defaultProps = {
    onCancel: noop,
    onApply: noop,
    value: null,
  };

  state = {
    selection: this.props.value
  };

  onSelectionChange = (event, data) => {
    const { value } = data;
    this.setState({ selection: value });
  };

  onCancel = () => {
    this.props.onCancel();
  };

  apply = () => {
    this.props.updateValue(this.state.selection);
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
                  active={selected === node.uid}
                  onClick={this.onSelectionChange}
                  key={node.uid}
                  value={node.uid}
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
    const topics = this.props.getTagById(TOPICS_ROOT);

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

export default connect(
  state => ({
    getTagById: tags.getTagById(state.tags),
  })
)(connectFilter({ isMultiple: true })(TopicsFilter));
