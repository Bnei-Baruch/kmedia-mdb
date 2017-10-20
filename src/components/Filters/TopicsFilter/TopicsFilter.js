import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import noop from 'lodash/noop';
import { Button, Divider, List, Segment } from 'semantic-ui-react';

import { TAG_LESSONS_TOPICS, TAG_PROGRAMS_TOPICS } from '../../../helpers/consts';
import { selectors as tags } from '../../../redux/modules/tags';
import connectFilter from '../connectFilter';

class TopicsFilter extends React.Component {

  static propTypes = {
    onCancel: PropTypes.func,
    onApply: PropTypes.func,
    updateValue: PropTypes.func.isRequired,
    value: PropTypes.string,
    getTagById: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
    allValues: PropTypes.arrayOf(PropTypes.string),
    namespace: PropTypes.string.isRequired,
  };

  static defaultProps = {
    onCancel: noop,
    onApply: noop,
    value: null,
    allValues: [],
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
    const selection = this.state.selection;
    if (selection === null) {
      return;
    }
    this.props.updateValue(selection);
    this.props.onApply();
  };

  canApply = () => this.state.selection && this.state.selection.length > 0;

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
              const node  = getTagById(x);
              const style = this.props.allValues.includes(x) && selected !== x ?
                { backgroundColor: 'lightgoldenrodyellow' } :
                {};

              return (
                <List.Item
                  key={node.id}
                  value={node.id}
                  style={style}
                  active={selected === node.id}
                  onClick={this.onSelectionChange}
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
    const { t, getTagById, namespace } = this.props;
    let topics;

    switch (namespace) {
    case 'lessons':
      topics = getTagById(TAG_LESSONS_TOPICS);
      break;
    case 'programs':
    case 'full-program':
      topics = getTagById(TAG_PROGRAMS_TOPICS);
      break;
    default:
      topics = '';
    }

    return (
      <Segment basic clearing attached="bottom" className="tab active">
        {
          topics.children ?
            this.createList(topics.children, this.state.selection) :
            'No topics'
        }
        <Divider />
        <Segment vertical clearing>
          <Button primary content={t('buttons.apply')} floated="right" disabled={!this.canApply()} onClick={this.apply} />
          <Button content={t('buttons.cancel')} floated="right" onClick={this.onCancel} />
        </Segment>
      </Segment>
    );
  }
}

export default connect(
  state => ({
    getTagById: tags.getTagById(state.tags),
  })
)(connectFilter()(TopicsFilter));
