import React  from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, Divider, List, Segment } from 'semantic-ui-react';
import noop from 'lodash/noop';
import { selectors as filterSelectors, actions as filterActions } from '../../../redux/modules/filters';
import { selectors as tags } from '../../../redux/modules/tags';

const filterName = 'topics-filter';

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
  }

  apply = () => {
    this.props.addFilterValue(this.props.namespace, filterName, this.state.selection);
    this.props.onApply();
  };

  createList = (topics, selected) => (
    <div
      key={selected}
      style={{
        height: '250px',
        overflowY: 'scroll'
      }}
    >
      <List divided relaxed selection>
        {
          topics.map(t => (
            <List.Item
              active={selected === t.uid}
              onClick={this.onSelectionChange}
              key={t.uid}
              value={t.uid}
            >
              {t.label}
            </List.Item>
          ))
        }
      </List>
    </div>
  );

  render() {
    return (
      <Segment basic attached="bottom" className="tab active" clearing>
        {
          !!this.props.topics ?
          this.createList(this.props.topics, this.state.selection) :
          'Loading...'
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
  topics: PropTypes.arrayOf(PropTypes.shape({
    uid: PropTypes.string.isRequired,
    pattern: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
  })),
  onCancel: PropTypes.func,
  onApply: PropTypes.func,
  addFilterValue: PropTypes.func.isRequired,
  lastSelection: PropTypes.string,
};

TopicsFilter.defaultProps = {
  topics: null,
  onCancel: noop,
  onApply: noop,
  lastSelection: null,
};

export default connect(
  (state, ownProps) => ({
    selection: filterSelectors.getLastFilterValue(state.filters, ownProps.namespace, filterName),
    topics: tags.getTopics(state.tags),
  }),
  filterActions
)(TopicsFilter);
