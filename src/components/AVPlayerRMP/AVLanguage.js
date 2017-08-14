import React, { Component } from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';
import { Dropdown } from 'semantic-ui-react';

import { LANG_HEBREW, LANGUAGE_OPTIONS } from '../../helpers/consts';

export default class AVLanguage extends Component {
  static propTypes = {
    onSelect: PropTypes.func,
    defaultValue: PropTypes.string,
    languages: PropTypes.arrayOf(PropTypes.string),
  };

  static defaultProps = {
    onSelect: noop,
    defaultValue: LANG_HEBREW,
    languages: [],
  };

  handleChange = (e, data) =>
    this.props.onSelect(e, data.value);

  render() {
    const { languages, defaultValue } = this.props;

    const options = LANGUAGE_OPTIONS
      .filter(x => languages.includes(x.value))
      .map(x => ({ value: x.value, text: x.value }));

    return (
      <div style={{ marginLeft: 10, marginRight: 10 }}>
        <Dropdown
          floating
          inline
          scrolling
          upward
          icon={null}
          selectOnBlur={false}
          options={options}
          defaultValue={defaultValue}
          onChange={this.handleChange}
          style={{ display: 'flex', textDecoration: 'underline' }}
        />
      </div>
    );
  }
}
