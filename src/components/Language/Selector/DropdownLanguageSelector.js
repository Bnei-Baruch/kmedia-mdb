import React from 'react';
import { translate } from 'react-i18next';
import { Dropdown } from 'semantic-ui-react';

import BaseLanguageSelector from './BaseLanguageSelector';
import classNames from 'classnames';

class DropdownLanguageSelector extends BaseLanguageSelector {
  handleSelect = (e, data) =>
    this.props.onSelect(e, data.value);

  render() {
    const { defaultValue: value, blink } = this.props;
    const options                        = this.getOptions(this.props);

    return (
      <Dropdown
        fluid
        item
        labeled
        selection
        scrolling
        value={value}
        options={options}
        onChange={this.handleSelect}
        openOnFocus={true}
        className={classNames('dropdown-language-selector', { 'blink': !!blink })}
      />
    );
  }
}

export default translate()(DropdownLanguageSelector);
