import React from 'react';
import isEqual from 'react-fast-compare';
import { withNamespaces } from 'react-i18next';
import { Button, Flag } from 'semantic-ui-react';

import { LANG_HEBREW, LANGUAGES } from '../../../helpers/consts';
import { getOptions } from '../../../helpers/language';

const ButtonsLanguageSelector = ({ languages = [], defaultValue = LANG_HEBREW, onSelect, t }) => {
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
            onClick={e => onSelect(e, x.value)}
          >
            <Flag name={LANGUAGES[x.value].flag} style={{ margin: 0 }} />
          </Button>
        ))
      }
    </Button.Group>
  );
};

const areEqual = (prevProps, nextProps) =>
  prevProps.defaultValue === nextProps.defaultValue
  && isEqual(prevProps.languages, nextProps.languages)

export default React.memo(withNamespaces()(ButtonsLanguageSelector), areEqual);
