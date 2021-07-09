import React from 'react';
import { withNamespaces } from 'react-i18next';
import { Dropdown } from 'semantic-ui-react';
import clsx from 'clsx';
import { noop } from '../../../helpers/utils';
import { getOptions } from '../../../helpers/language';
import { LANG_HEBREW } from '../../../helpers/consts';

const DropdownLanguageSelector = ({ languages = [], defaultValue: value = LANG_HEBREW, blink, onSelect = noop, fluid = true }) => {
  const handleSelect = (e, data) => onSelect(e, data.value);

  const options = getOptions({ languages });

  return (
    <Dropdown
      fluid={fluid}
      item
      labeled
      selection
      scrolling
      value={value}
      options={options}
      onChange={handleSelect}
      className={clsx('dropdown-language-selector', { blink: !!blink })}
    />
  );
};

export default withNamespaces()(DropdownLanguageSelector);
