import React, {useContext} from 'react';
import { withNamespaces } from 'react-i18next';
import { Dropdown } from 'semantic-ui-react';
import classNames from 'classnames';
import { noop } from '../../../helpers/utils';
import { getOptions } from '../../../helpers/language';
import {LANG_HEBREW, LANG_UI_LANGUAGES, LANGUAGES} from '../../../helpers/consts';
import {DeviceInfoContext} from "../../../helpers/app-contexts";

function DesktopLanguageSelector(value, fluid, options, handleSelect, blink) {
  return (
    <Dropdown item text={LANGUAGES[value].name} fluid={fluid}>
      <Dropdown.Menu>
        {
          options.map(lang =>
            <Dropdown.Item
              key={lang.value}
              language={`${lang}`}
              active={lang.value === value}
              onClick={(e) => handleSelect(e, lang)}
              className={classNames('dropdown-language-selector', {blink: !!blink})}
            >
              {lang.text}
            </Dropdown.Item>
          )
        }
      </Dropdown.Menu>
    </Dropdown>
  );
}

function MobileLanguageSelector(value, fluid, options, handleSelect) {
  return (
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
}

const MenuLanguageSelector = ({ languages = [], defaultValue: value = LANG_HEBREW, blink, onSelect = noop, fluid = true }) => {
  const { isMobileDevice } = useContext(DeviceInfoContext);
  const handleSelect = (e, data) => onSelect(e, data.value);
  const options = getOptions({ languages });
  return isMobileDevice ?
    MobileLanguageSelector(value, fluid, options, handleSelect) :
    DesktopLanguageSelector(value, fluid, options, handleSelect, blink);
};

export default withNamespaces()(MenuLanguageSelector);
