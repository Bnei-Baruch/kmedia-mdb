import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import noop from 'lodash/noop';
import { Accordion, Button, Flag, Header, Menu, Segment } from 'semantic-ui-react';
import { ALL_LANGUAGES, LANGUAGES } from '../../../helpers/consts';

class LanguageFilter extends Component {
  static propTypes = {
    value: PropTypes.string,
    onCancel: PropTypes.func,
    onApply: PropTypes.func,
    t: PropTypes.func.isRequired,
  };

  static defaultProps = {
    value: null,
    onCancel: noop,
    onApply: noop,
  };

  state = {
    sValue: this.props.value
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.value !== nextProps.value) {
      this.setState({ sValue: nextProps.value });
    }
  }

  onLanguageChange = (event, data) => {
    this.setState({ sValue: `${data.name}` });
  };

  onCancel = () =>
    this.props.onCancel();

  apply = () => {
    this.props.onApply(this.state.sValue);
  };

  toggleCustom = () =>
    this.setState({ showCustom: !this.state.showCustom });

  render() {
    const { t }      = this.props;
    const { sValue } = this.state;

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
            <Header size="small" textAlign="center" content={t('filters.language-filter.label')} />
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
        <Segment className="filter-popup__body language-filter">
          <Accordion as={Menu} vertical fluid size="small">
            {
              ALL_LANGUAGES.map((x) => {
                return (
                  <Menu.Item
                    key={x}
                    name={x}
                    active={sValue === x}
                    onClick={this.onLanguageChange}
                  >
                    <Flag name={LANGUAGES[x].flag} />
                    {t(`constants.languages.${x}`)}
                  </Menu.Item>
                );
              })
            }
          </Accordion>
        </Segment>
      </Segment.Group>
    );
  }
}

export default withNamespaces()(LanguageFilter);
