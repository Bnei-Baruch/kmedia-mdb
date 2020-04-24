import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Flag } from 'semantic-ui-react';

import { LANG_HEBREW, LANGUAGES } from '../../../helpers/consts';
import { getOptions } from '../../../helpers/language';

const ButtonsLanguageSelector = ({ languages = [], defaultValue = LANG_HEBREW, onSelect }) => {
  const { t }        = useTranslation('common', { useSuspense: false });
  const handleSelect = (e, lang) => onSelect(e, lang);

  const options = getOptions({ languages, t });

  return (
    <Button.Group basic className="buttons-language-selector" size="small">
      {
        options.map(x => (
          <Button
            icon
            key={x.value}
            active={x.value === defaultValue}
            title={x.text}
            onClick={e => handleSelect(e, x.value)}
          >
            <Flag name={LANGUAGES[x.value].flag} style={{ margin: 0 }} />
          </Button>
        ))
      }
    </Button.Group>
  );
};

export default ButtonsLanguageSelector;
