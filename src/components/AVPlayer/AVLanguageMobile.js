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
  };

  static defaultProps = {
    onSelect: noop,
    language: LANG_HEBREW,
    requestedLanguage: LANG_HEBREW,
    languages: [],
  };

  handleChange = (e) => {
    this.props.onSelect(e, e.currentTarget.value);
  };

  render() {
    const { t, languages, language, requestedLanguage } = this.props;

    const options = LANGUAGE_OPTIONS
      .filter(x => languages.includes(x.value))
      .map(x => x.value);

    const popup = language === requestedLanguage ? null : (
      <TimedPopup
        openOnInit
        message={t('messages.fallback-language')}
        downward={false}
        timeout={7000}
      />
    );

    return (
      <div className="mediaplayer__languages">
        {popup}
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
