import React from 'react';
import { useTranslation } from 'react-i18next';
import { Dropdown } from 'semantic-ui-react';
import classNames from 'classnames';
import noop from 'lodash/noop';
import { getOptions } from '../../../helpers/language';
import { LANG_HEBREW } from '../../../helpers/consts';

const DropdownLanguageSelector = ({ languages = [], defaultValue: value = LANG_HEBREW, blink, onSelect = noop }) => {
  const { t }        = useTranslation('common', { useSuspense: false });
  const handleSelect = (e, data) => onSelect(e, data.value);

  const options = getOptions({ languages, t });

  return (
    <Dropdown
      fluid
      item
      labeled
      selection
      scrolling
      value={value}
      options={options}
      onChange={handleSelect}
      className={classNames('dropdown-language-selector', { blink: !!blink })}
    />
  );
};

export default DropdownLanguageSelector;
