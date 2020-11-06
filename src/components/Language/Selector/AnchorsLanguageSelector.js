import React from 'react';
import { withNamespaces } from 'react-i18next';
import { Flag } from 'semantic-ui-react';
import { noop } from '../../../helpers/utils';

import { LANGUAGES } from '../../../helpers/consts';
import Link from '../MultiLanguageLink';
import { getOptions } from '../../../helpers/language';

const AnchorsLanguageSelector = ({ languages = [], onSelect = noop, t }) => {
  const handleSelect = (e, lang) => {
    e.preventDefault();
    onSelect(e, lang);
  };

  const options = getOptions({ languages, t });

  return (
    <div className="anchors-language-selector">
      {
        options.map(x => (
          <Link
            key={x.value}
            title={x.text}
            onClick={e => handleSelect(e, x.value)}
          >
            <Flag name={LANGUAGES[x.value].flag} />
          </Link>
        ))
      }
    </div>
  );
};

export default withNamespaces()(AnchorsLanguageSelector);
