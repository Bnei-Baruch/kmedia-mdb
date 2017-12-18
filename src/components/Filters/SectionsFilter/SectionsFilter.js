import React from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';
import { Button, Divider, List, Segment } from 'semantic-ui-react';

import connectFilter from '../connectFilter';
import { options } from '../../../filters/definitions/sectionsFilter';

class SectionsFilter extends React.Component {

  static propTypes = {
    onCancel: PropTypes.func,
    onApply: PropTypes.func,
    updateValue: PropTypes.func.isRequired,
    value: PropTypes.string,
    t: PropTypes.func.isRequired,
    namespace: PropTypes.string.isRequired,
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
    const selection = this.state.selection;
    if (selection === null) {
      return;
    }
    this.props.updateValue(selection);
    this.props.onApply();
  };

  canApply = () => this.state.selection && this.state.selection.length > 0;

  createList = (sections, selected) => {
    if (!Array.isArray(sections)) {
      return null;
    }

    return (
      <div
        style={{
          height: '90px',
          overflowY: 'scroll'
        }}
      >
        <List divided relaxed selection>
          {
            sections.map((x) => {
              const style = this.props.value === x && selected !== x ?
                { backgroundColor: 'lightgoldenrodyellow' } :
                {};

              return (
                <List.Item
                  key={x}
                  value={x}
                  style={style}
                  active={selected === x}
                  onClick={this.onSelectionChange}
                >
                  {this.props.t(x)}
                </List.Item>
              );
            })
          }
        </List>
      </div>
    );
  };

  render() {
    const { t } = this.props;

    const sections = Object.keys(options);

    return (
      <Segment basic clearing attached="bottom" className="tab active">
        { this.createList(sections, this.state.selection) }
        <Divider />
        <Segment vertical clearing>
          <Button primary content={t('buttons.apply')} floated="right" disabled={!this.canApply()} onClick={this.apply} />
          <Button content={t('buttons.cancel')} floated="right" onClick={this.onCancel} />
        </Segment>
      </Segment>
    );
  }
}

export default connectFilter()(SectionsFilter);
