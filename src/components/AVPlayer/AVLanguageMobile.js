import React, { Component } from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';
import { withNamespaces } from 'react-i18next';

import { LANG_HEBREW, LANGUAGE_OPTIONS } from '../../helpers/consts';
import TimedPopup from '../shared/TimedPopup';

class AVLanguageMobile extends Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
    onSelect: PropTypes.func,
    selectedLanguage: PropTypes.string,
    requestedLanguage: PropTypes.string,
    languages: PropTypes.arrayOf(PropTypes.string),
    uiLanguage: PropTypes.string.isRequired,
  };

  static defaultProps = {
    onSelect: noop,
    selectedLanguage: LANG_HEBREW,
    requestedLanguage: LANG_HEBREW,
    languages: [],
  };

  state = {};

  UNSAFE_componentWillReceiveProps() {
    const { selectedLanguage, requestedLanguage } = this.props;
    this.handlePopup(selectedLanguage, requestedLanguage);
  }

  setLangSelectRef = langSelectRef => this.setState({ langSelectRef });

  handleChange = e => this.props.onSelect(e, e.currentTarget.value);

  handlePopup = (selectedLanguage, requestedLanguage) => {
    if (requestedLanguage === null) {
      return;
    }
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

  render() {
    const { t, languages, selectedLanguage, uiLanguage } = this.props;
    const { langSelectRef, openPopup }                   = this.state;

    const options = LANGUAGE_OPTIONS
      .filter(x => languages.includes(x.value))
      .map(x => x.value);

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
        <select value={selectedLanguage} onChange={this.handleChange}>
          {
            options.map(x => (
              <option key={x} value={x}>
                {x}
              </option>
            ))
          }
        </select>
      </div>
    );
  }
}

export default withNamespaces()(AVLanguageMobile);
