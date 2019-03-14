import React from 'react';
import { withNamespaces } from 'react-i18next';
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
            // eslint-disable-next-line jsx-a11y/anchor-is-valid
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

export default withNamespaces()(AnchorsLanguageSelector);
