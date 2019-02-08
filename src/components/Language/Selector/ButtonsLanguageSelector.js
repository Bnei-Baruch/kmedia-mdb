import React from 'react';
import { withNamespaces } from 'react-i18next';
import { Button, Flag } from 'semantic-ui-react';

import { LANGUAGES } from '../../../helpers/consts';
import BaseLanguageSelector from './BaseLanguageSelector';

class ButtonsLanguageSelector extends BaseLanguageSelector {
  handleSelect = (e, lang) => this.props.onSelect(e, lang);

  render() {
    const { defaultValue } = this.props;
    const options          = this.getOptions(this.props);

    return (
      <Button.Group basic className="buttons-language-selector" size="small">
        {
          options.map(x => (
            <Button
              icon
              key={x.value}
              active={x.value === defaultValue}
              title={x.text}
              onClick={e => this.handleSelect(e, x.value)}
            >
              <Flag name={LANGUAGES[x.value].flag} style={{ margin: 0 }} />
            </Button>
          ))
        }
      </Button.Group>
    );
  }
}

export default withNamespaces()(ButtonsLanguageSelector);
