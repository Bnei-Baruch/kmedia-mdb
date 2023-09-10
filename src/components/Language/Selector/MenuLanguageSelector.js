import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { withTranslation } from 'next-i18next';
import { Checkbox, Grid, Dropdown, Label, Modal } from 'semantic-ui-react';
import { noop } from '../../../helpers/utils';
import { getOptions } from '../../../helpers/language';
import { ALL_LANGUAGES, LANGUAGES } from '../../../helpers/consts';
import { selectors as settings } from '../../../../lib/redux/slices/settingsSlice/settingsSlice';

const applyChecked = (language, checked, selected, isAny) => {
  if (isAny) {
    if (checked) {
      return [language];
    }
    return [];
  }

  const newSelected = selected.filter(selectedLang => selectedLang  !== language);
  if (checked) {
    newSelected.push(language);
  }

  return newSelected;
}

const applyAll = () => {
  return ALL_LANGUAGES;
}

const LanguageSelector = (selected, options, onLanguageChange, isAny, multiSelect, optionText, upward) => {
  const onChange = (selected) => {
    onLanguageChange(selected);
  };
  const finalOptions = isAny ? [{text: 'Any', value: 'any'}] : options;
  return (
    <Dropdown
      selection
      upward={upward}
      multiple={multiSelect}
      value={multiSelect ? (isAny ? ['any'] : selected) : selected}
      onChange={(event, data) => onChange(data.value)}
      options={options}
    />
  );
}

const MenuLanguageSelector = ({ languages = [], selected = [], onLanguageChange = noop, multiSelect = true, optionText = null, upward = false}) => {
  const contentLanguages = useSelector(state => settings.getContentLanguages(state.settings));
  const onLanguageChangeInternal = selected => {
    onLanguageChange(selected);
  };

  const validLanguages = languages.filter(lang => contentLanguages.includes(lang));
  const otherLanguages = languages.filter(lang => !contentLanguages.includes(lang));
  const options = getOptions({ languages: validLanguages }).concat([{className: 'language-selection-divider disabled'}]).concat(getOptions({ languages: otherLanguages}));
  // Special case when all laguages are selected, e.g., show content with any language.
  const isAny = languages === selected;
  return LanguageSelector(selected, options, onLanguageChangeInternal, isAny, multiSelect, optionText, upward);
};

export default MenuLanguageSelector;
