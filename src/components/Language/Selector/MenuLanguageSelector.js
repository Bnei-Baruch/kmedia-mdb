import React, { useContext } from 'react';
import { withTranslation } from 'react-i18next';
import { Dropdown } from 'semantic-ui-react';
import classNames from 'classnames';
import { noop } from '../../../helpers/utils';
import { getOptions } from '../../../helpers/language';
import { LANG_HEBREW, LANGUAGES } from '../../../helpers/consts';
import { DeviceInfoContext } from '../../../helpers/app-contexts';

const DesktopLanguageSelector = (value, fluid, options, handleSelect, blink) => (
  <Dropdown item text={LANGUAGES[value].name} fluid={fluid}>
    <Dropdown.Menu>
      {
        options.map(lang =>
          <Dropdown.Item
            key={lang.value}
            language={`${lang}`}
            active={lang.value === value}
            onClick={e => handleSelect(e, lang)}
            className={classNames('dropdown-language-selector', { blink: !!blink })}
          >
            {lang.text}
          </Dropdown.Item>
        )
      }
    </Dropdown.Menu>
  </Dropdown>
);

const MobileLanguageSelector = (value, fluid, options, handleSelect) => (
  <select
    className="dropdown-container"
    value={value}
    onChange={e => handleSelect(e, e.currentTarget)}
  >
    {
      options.map(x =>
        <option key={`opt-${x.value}`} value={x.value}>
          {x.name}
        </option>)
    }
  </select>
);

const MenuLanguageSelector = ({ languages = [], defaultValue: value = LANG_HEBREW, blink, onSelect = noop, fluid = true }) => {
  const { isMobileDevice } = useContext(DeviceInfoContext);
  const handleSelect = (e, data) => onSelect(e, data.value);
  const options = getOptions({ languages });
  return isMobileDevice ?
    MobileLanguageSelector(value, fluid, options, handleSelect) :
    DesktopLanguageSelector(value, fluid, options, handleSelect, blink);
};

export default withTranslation()(MenuLanguageSelector);
