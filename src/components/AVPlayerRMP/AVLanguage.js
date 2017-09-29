import React, { Component } from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';
import { Dropdown } from 'semantic-ui-react';
import classNames from 'classnames';

import { LANG_HEBREW, LANGUAGE_OPTIONS } from '../../helpers/consts';
import TimedPopup from '../shared/TimedPopup';

export default class AVLanguage extends Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
    onSelect: PropTypes.func,
    language: PropTypes.string,
    requestedLanguage: PropTypes.string,
    languages: PropTypes.arrayOf(PropTypes.string),
    upward: PropTypes.bool,
  };

  static defaultProps = {
    onSelect: noop,
    language: LANG_HEBREW,
    requestedLanguage: LANG_HEBREW,
    languages: [],
    upward: true,
  };

  handleChange = (e, data) =>
    this.props.onSelect(e, data.value);

  render() {
    const { t, languages, language, requestedLanguage, upward } = this.props;

    const options = LANGUAGE_OPTIONS
      .filter(x => languages.includes(x.value))
      .map(x => ({ value: x.value, text: x.value }));

    const popup = language === requestedLanguage ? null : (
      <TimedPopup
        openOnInit
        message={t('messages.fallback-language')}
        downward={!upward}
        timeout={7000}
      />
    );

    return (
      <div
        className="player-control-language"
      >
        { popup }
        <Dropdown
          floating
          inline
          scrolling
          upward={upward}
          icon={null}
          selectOnBlur={false}
          options={options}
          value={language}
          onChange={this.handleChange}
          className={classNames('player-button')}
          style={{ display: 'flex', textDecoration: 'underline' }}
        />
      </div>
    );
  }
}
