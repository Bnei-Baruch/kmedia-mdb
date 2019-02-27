import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import noop from 'lodash/noop';
import { Dropdown } from 'semantic-ui-react';

import { LANG_HEBREW, LANGUAGE_OPTIONS } from '../../helpers/consts';
import TimedPopup from '../shared/TimedPopup';

class AVLanguage extends Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
    onSelect: PropTypes.func,
    selectedLanguage: PropTypes.string,
    requestedLanguage: PropTypes.string,
    languages: PropTypes.arrayOf(PropTypes.string),
    uiLanguage: PropTypes.string,
  };

  static defaultProps = {
    onSelect: noop,
    selectedLanguage: LANG_HEBREW,
    requestedLanguage: LANG_HEBREW,
    languages: [],
    uiLanguage: LANG_HEBREW,
  };

  state = {};

  componentWillReceiveProps() {
    const { selectedLanguage, requestedLanguage } = this.props;
    this.handlePopup(selectedLanguage, requestedLanguage);
  }

  handleChange = (e, data) => this.props.onSelect(e, data.value);

  handlePopup = (selectedLanguage, requestedLanguage) => {
    const { lastRequestedLanguage } = this.state;
    if (lastRequestedLanguage === requestedLanguage) {
      this.setState({ openPopup: false });
      return;
    }

    this.setState({
      lastRequestedLanguage: requestedLanguage,
      openPopup: (selectedLanguage !== requestedLanguage)
    });
  };

  setLangSelectRef = langSelectRef => this.setState({ langSelectRef });

  render() {
    const { t, languages, selectedLanguage, uiLanguage } = this.props;
    const { langSelectRef, openPopup }                   = this.state;

    const options = LANGUAGE_OPTIONS
      .filter(x => languages.includes(x.value))
      .map(x => ({ value: x.value, text: x.value }));

    return (
      <div ref={this.setLangSelectRef} className="mediaplayer__languages">
        <TimedPopup
          openOnInit={openPopup}
          message={t('messages.fallback-language')}
          downward={false}
          timeout={7000}
          language={uiLanguage}
          refElement={langSelectRef}
        />
        <Dropdown
          floating
          scrolling
          upward
          icon={null}
          selectOnBlur={false}
          options={options}
          value={selectedLanguage}
          onChange={this.handleChange}
          trigger={<button>{selectedLanguage}</button>}
        />
      </div>
    );
  }
}

export default withNamespaces()(AVLanguage);
