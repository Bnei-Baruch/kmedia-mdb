import React, { Component } from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';

import { LANG_HEBREW, LANGUAGE_OPTIONS } from '../../helpers/consts';
import TimedPopup from '../shared/TimedPopup';

export default class AVLanguageMobile extends Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
    onSelect: PropTypes.func,
    language: PropTypes.string,
    requestedLanguage: PropTypes.string,
    languages: PropTypes.arrayOf(PropTypes.string),
    uiLanguage: PropTypes.string,
  };

  static defaultProps = {
    onSelect: noop,
    language: LANG_HEBREW,
    requestedLanguage: LANG_HEBREW,
    languages: [],
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  handleChange = (e) => {
    this.props.onSelect(e, e.currentTarget.value);
  };

  setLangSelectRef = (langSelectRef) => this.setState({ langSelectRef });

  render() {
    const { t, languages, language, uiLanguage, requestedLanguage } = this.props;
    const { langSelectRef }                                         = this.state;
    const openPopup                                                 = language !== requestedLanguage;

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
        <select value={language} onChange={this.handleChange}>
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
