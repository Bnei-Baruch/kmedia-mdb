import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, Divider, List, Segment } from 'semantic-ui-react';
import noop from 'lodash/noop';

import { TAG_ROOT_TOPICS } from '../../../helpers/consts';
import { actions as filterActions, selectors as filterSelectors } from '../../../redux/modules/filters';
import { selectors as tags } from '../../../redux/modules/tags';
import connectFilter from '../connectFilter';


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

  componentWillReceiveProps(nextProps) {
    this.setState({
      selection: nextProps.value
    });
  }

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

export default connect(
  state => ({
    getTagById: tags.getTagById(state.tags),
  })
)(connectFilter({ isMultiple: true })(TopicsFilter));
