import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import noop from 'lodash/noop';
import { Accordion, Button, Header, Menu, Segment, Flag } from 'semantic-ui-react';
import { ALL_LANGUAGES, LANGUAGES, AUDIO_BLOG_LANGUAGES } from '../../../helpers/consts';

class LanguageFilter extends Component {
  static propTypes = {
    namespace: PropTypes.string,
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
    showCustom: false
  };

  onLanguageChange = (event, data) => {
    this.props.onApply(data.name);
  };

  onCancel = () => this.props.onCancel();

  toggleCustom = () => {
    const { showCustom } = this.state;
    this.setState({ showCustom: !showCustom });
  };

  render() {
    const { t, value, namespace }      = this.props;
    const displayedLanguages = namespace === 'publications-audio-blog'
      ? AUDIO_BLOG_LANGUAGES
      : ALL_LANGUAGES;

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
          </div>
        </Segment>
        <Segment className="filter-popup__body language-filter">
          <Accordion as={Menu} vertical fluid size="small">
            {
              displayedLanguages.map(x => (
                (
                  <Menu.Item
                    key={x}
                    name={x}
                    active={value === x}
                    onClick={this.onLanguageChange}
                  >
                    <Flag name={LANGUAGES[x].flag} />
                    {t(`constants.languages.${x}`)}
                  </Menu.Item>
                )
              ))
            }
          </Accordion>
        </Segment>
      </Segment.Group>
    );
  }
}

export default withNamespaces()(LanguageFilter);
