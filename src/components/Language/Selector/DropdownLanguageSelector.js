import React from 'react';
import { withNamespaces } from 'react-i18next';
import { Dropdown } from 'semantic-ui-react';
import classNames from 'classnames';

import BaseLanguageSelector from './BaseLanguageSelector';

class DropdownLanguageSelector extends BaseLanguageSelector {
  handleSelect = (e, data) => this.props.onSelect(e, data.value);

  render() {
    const { defaultValue: value, blink } = this.props;
    const options                        = BaseLanguageSelector.getOptions(this.props);

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
        className={classNames('dropdown-language-selector', { blink: !!blink })}
      />
    );
  }
}

export default withNamespaces()(DropdownLanguageSelector);
