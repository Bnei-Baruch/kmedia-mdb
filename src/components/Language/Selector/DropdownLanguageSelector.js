import React from 'react';
import { translate } from 'react-i18next';
import { Dropdown } from 'semantic-ui-react';

import BaseLanguageSelector from './BaseLanguageSelector';

class DropdownLanguageSelector extends BaseLanguageSelector {

  handleSelect = (e, data) =>
    this.props.onSelect(e, data.value);

  render() {
    const { defaultValue } = this.props;
    const options          = this.getOptions(this.props);

    return (
      <Dropdown
        fluid
        item
        labeled
        selection
        scrolling
        className="dropdown-language-selector"
        defaultValue={defaultValue}
        value={defaultValue}
        options={options}
        onChange={this.handleSelect}
      />
    );
  }
}

export default translate()(DropdownLanguageSelector);
