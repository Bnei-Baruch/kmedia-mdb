/* eslint-disable react/no-unused-prop-types */
import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';

import { LANG_HEBREW, LANGUAGE_OPTIONS } from '../../../helpers/consts';

class LanguageSelector extends PureComponent {
  /* eslint-disable react/no-unused-prop-types */
  static propTypes = {
    onSelect: PropTypes.func,
    defaultValue: PropTypes.string,
    languages: PropTypes.arrayOf(PropTypes.string),
    t: PropTypes.func.isRequired,
  };

  static defaultProps = {
    onSelect: noop,
    defaultValue: LANG_HEBREW,
    languages: [],
  };

  static getOptions(props) {
    // eslint-disable-next-line class-methods-use-this
    const { languages, t } = props;

    return LANGUAGE_OPTIONS
      .filter(x => languages.includes(x.value))
      .map(x => ({ ...x, text: t(`constants.languages.${x.value}`) }));
  }

  render() {
    return null;
  }
}

export default LanguageSelector;
