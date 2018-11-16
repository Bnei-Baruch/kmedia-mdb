import React from 'react';
import { translate } from 'react-i18next';
import { Flag } from 'semantic-ui-react';

import { LANGUAGES } from '../../../helpers/consts';
import BaseLanguageSelector from './BaseLanguageSelector';
import Link from '../MultiLanguageLink';

class AnchorsLanguageSelector extends BaseLanguageSelector {
  handleSelect = (e, lang) => {
    e.preventDefault();
    this.props.onSelect(e, lang);
  };

  render() {
    const options = this.getOptions(this.props);

    return (
      <div className="anchors-language-selector">
        {
          options.map(x => (
            <Link
              key={x.value}
              title={x.text}
              onClick={e => this.handleSelect(e, x.value)}
            >
              <Flag name={LANGUAGES[x.value].flag} />
            </Link>
          ))
        }
      </div>
    );
  }
}

export default translate()(AnchorsLanguageSelector);
