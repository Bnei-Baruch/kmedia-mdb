import React, { Component } from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';
import { Dropdown } from 'semantic-ui-react';

import { LANG_HEBREW, LANGUAGE_OPTIONS } from '../../helpers/consts';
import TimedPopup from '../shared/TimedPopup';

export default class AVLanguage extends Component {
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

  state = {};

  handleChange = (e, data) =>
    this.props.onSelect(e, data.value);

  setLangSelectRef = (langSelectRef) => this.setState({ langSelectRef });

  render() {
    const { t, languages, language, uiLanguage, requestedLanguage } = this.props;
    const { langSelectRef }                                         = this.state;
    const openPopup                                                 = language !== requestedLanguage;

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
          value={language}
          onChange={this.handleChange}
          trigger={<button>{language}</button>}
        />
      </div>
    );
  }
}
