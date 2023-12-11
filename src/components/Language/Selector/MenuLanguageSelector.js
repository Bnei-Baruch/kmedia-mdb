import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import { Dropdown } from 'semantic-ui-react';
import { DeviceInfoContext } from '../../../helpers/app-contexts';
import { noop } from '../../../helpers/utils';
import { getOptions } from '../../../helpers/language';
import { selectors as settings } from '../../../redux/modules/settings';

const MenuLanguageSelector = ({ languages = [], selected = [], onLanguageChange = noop, multiSelect = true,  upward = false }) => {
  const uiDir = useSelector(state => settings.getUIDir(state.settings));
  const { isMobileDevice } = useContext(DeviceInfoContext);
  const contentLanguages = useSelector(state => settings.getContentLanguages(state.settings));
  const onChange = selected => {
    onLanguageChange(selected);
  };

  const validLanguages = languages.filter(lang => contentLanguages.includes(lang));
  const otherLanguages = languages.filter(lang => !contentLanguages.includes(lang));
  const dividerArray = !isMobileDevice || multiSelect ? [{ value: 'divider', className: 'language-selection-divider disabled' }] : [];
  const options = getOptions({ languages: validLanguages }).concat(dividerArray).concat(getOptions({ languages: otherLanguages }));
  // Special case when all laguages are selected, e.g., show content with any language.
  const isAny = languages === selected;

  const value = multiSelect ? (isAny ? ['any'] : selected) : selected;

  if (isMobileDevice && !multiSelect) {
    return (
      <select
        className="language-mobile-select"
        style={{ direction: uiDir }}
        value={value}
        onChange={event => onChange(event.target.value)}>
        { options.map(x => <option key={`opt-${x.value}`} value={x.value}>{x.name}</option>) }
      </select>
    );
  }

  return (
    <Dropdown
      selection
      upward={upward}
      multiple={multiSelect}
      value={value}
      onChange={(event, data) => onChange(data.value)}
      options={options}
    />
  );
};

export default MenuLanguageSelector;
