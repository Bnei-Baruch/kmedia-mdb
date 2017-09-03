import React, { Component } from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';
import { Dropdown } from 'semantic-ui-react';
import classNames from 'classnames';

import { LANG_HEBREW, LANGUAGE_OPTIONS } from '../../helpers/consts';

export default class AVLanguage extends Component {
  static propTypes = {
    onSelect: PropTypes.func,
    defaultValue: PropTypes.string,
    languages: PropTypes.arrayOf(PropTypes.string),
    upward: PropTypes.bool,
  };

  static defaultProps = {
    onSelect: noop,
    defaultValue: LANG_HEBREW,
    languages: [],
    upward: true,
  };

  handleChange = (e, data) =>
    this.props.onSelect(e, data.value);

  render() {
    const { languages, defaultValue, upward } = this.props;

    const options = LANGUAGE_OPTIONS
      .filter(x => languages.includes(x.value))
      .map(x => ({ value: x.value, text: x.value }));

    return (
      <div className="player-control-language">
        <Dropdown
          upward={upward}
          icon={null}
          selectOnBlur={false}
          options={options}
          value={defaultValue}
          onChange={this.handleChange}
          className={classNames('player-button')}
          style={{ display: 'flex', textDecoration: 'underline' }}
        />
      </div>
    );
  }
}
