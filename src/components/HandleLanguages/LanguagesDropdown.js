import React from 'react';
import { Dropdown } from 'semantic-ui-react';

import { ALL_LANGUAGES, LANGUAGES } from '../../helpers/consts';
import Link from '../Language/MultiLanguageLink';

const LanguagesDropdown = ({ disabled, trigger, language, selected, asLink }) => (
  <Dropdown disabled={disabled} item scrolling trigger={trigger} icon={trigger ? null : 'dropdown'}>
    <Dropdown.Menu>
      {ALL_LANGUAGES.map(lang => (
        <Dropdown.Item
          key={lang}
          as={asLink ? Link : undefined}
          language={`${lang}`}
          active={lang === language}
          onClick={() => selected(lang)}
        >
          {LANGUAGES[lang].name}
        </Dropdown.Item>
      ))}
    </Dropdown.Menu>
  </Dropdown>
);

export default LanguagesDropdown;
