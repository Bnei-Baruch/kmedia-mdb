import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import noop from 'lodash/noop';
import { Button, Header, Menu, Segment } from 'semantic-ui-react';

class FlatListFilter extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(PropTypes.shape({
      text: PropTypes.string.isRequired,
      value: PropTypes.any.isRequired,
    })),
    value: PropTypes.any,
    onCancel: PropTypes.func,
    onApply: PropTypes.func,
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
    this.props.onApply(this.state.sValue);
  };

  render() {
    const { options, name, renderItem, t } = this.props;
    const { sValue }                       = this.state;

    return (
      <Segment.Group className="filter-popup__wrapper">
        <Segment basic secondary className="filter-popup__header">
          <div className="title">
            <Button
              basic
              compact
              size="tiny"
              content={t('buttons.cancel')}
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
        </Segment>
        <Segment basic className="filter-popup__body">
          <Menu vertical fluid size="small">
            {
              options.map(x => (
                <Menu.Item
                  key={x.value}
                  name={x.text}
                  active={sValue === x.value}
                  onClick={this.onSelectionChange}
                >
                  {renderItem(x)}
                </Menu.Item>
              ))
            }
          </Menu>
        </Segment>
      </Segment.Group>
    );
  }
}

export default withNamespaces()(FlatListFilter);
