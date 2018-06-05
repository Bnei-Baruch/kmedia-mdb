import React from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';
import { Button, Header, Menu, Segment, Icon, Input } from 'semantic-ui-react';

import connectFilter from './connectFilter';

class HierarchicalFilter extends React.Component {
  static propTypes = {
    namespace: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(PropTypes.shape({
      text: PropTypes.string.isRequired,
      value: PropTypes.any.isRequired,
    })),
    value: PropTypes.any,
    onCancel: PropTypes.func,
    onApply: PropTypes.func,
    updateValue: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
    renderItem: PropTypes.func,
  };

  static defaultProps = {
    options: [],
    value: null,
    onCancel: noop,
    onApply: noop,
    renderItem: x => x.text,
  };

  state = {
    sValue: this.props.value
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.value !== nextProps.value) {
      this.setState({ sValue: nextProps.value });
    }
  }

  onSelectionChange = (event, data) => {
    const { value } = this.props.options.find(x => x.text === data.name);
    this.setState({ sValue: value });
  };

  onCancel = () => {
    this.props.onCancel();
  };

  apply = () => {
    this.props.updateValue(this.state.sValue);
    this.props.onApply();
  };

  render() {
    const { options, name, renderItem, t } = this.props;
    const { sValue }                       = this.state;

    return (
      <Segment.Group>
        <Segment secondary className="filter-popup__header">
          <div className="title">
            <Button
              basic
              compact
              icon="remove"
              onClick={this.onCancel}
            />
            <Header size="small" textAlign="center" content={t(`filters.${name}.label`)} />
            <Button
              primary
              compact
              size="small"
              content={t('buttons.apply')}
              disabled={!sValue}
              onClick={this.apply}
            />
          </div>
          <Input fluid className="autocomplete" size="small" icon="search" placeholder="Search..." />
        </Segment>
        <Segment className="filter-popup__body">
          <Menu vertical fluid size="small" className="hierarchy">
            <Menu.Item className="l1">Cats</Menu.Item>
            <Menu.Item className="l1">Horses</Menu.Item>
            <Menu.Item className="l1">Dogs</Menu.Item>
            <Menu.Item className="l2">Shiba Inu</Menu.Item>
            <Menu.Item className="l2">Mastiff</Menu.Item>
            <Menu.Item className="l3">Mastiff 3</Menu.Item>
            <Menu.Item className="l3">Mastiff <span className="count">(4)</span></Menu.Item>
            <Menu.Item className="l3">Mastiff 3</Menu.Item>
            <Menu.Item className="l3">Mastiff 4</Menu.Item>
            <Menu.Item className="l3">Mastiff 3</Menu.Item>
            <Menu.Item className="l3">Mastiff 4</Menu.Item>
            <Menu.Item className="l3">Mastiff 3</Menu.Item>
            <Menu.Item className="l3">Mastiff 4</Menu.Item>
            <Menu.Item className="l3">Mastiff 3</Menu.Item>
            <Menu.Item className="l3" active>Mastiff 4</Menu.Item>
            <Menu.Item className="l3">Mastiff 3</Menu.Item>
            <Menu.Item className="l3">Mastiff 4</Menu.Item>
            <Menu.Item className="l3">Mastiff 3</Menu.Item>
            <Menu.Item className="l3">Mastiff 4</Menu.Item>
            <Menu.Item className="l3">Mastiff 3</Menu.Item>
            <Menu.Item className="l3">Mastiff 4</Menu.Item>
            <Menu.Item className="l3">Mastiff 3</Menu.Item>
            <Menu.Item className="l3">Mastiff 4</Menu.Item>
          </Menu>
        </Segment>
      </Segment.Group>
    );
  }
}

export default connectFilter()(HierarchicalFilter);
