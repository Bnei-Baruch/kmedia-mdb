import React from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';
import { translate } from 'react-i18next';
import { Dropdown } from 'semantic-ui-react';

import { LANG_HEBREW, LANGUAGE_OPTIONS } from '../../helpers/consts';

const LanguageSelector = (props) => {
  const { languages, defaultValue, onSelect, t } = props;

  const options = LANGUAGE_OPTIONS
    .filter(x => languages.includes(x.value))
    .map(x => ({ ...x, text: t(`constants.languages.${x.value}`) }));

  return (
    <Dropdown
      fluid
      item
      labeled
      selection
      scrolling
      defaultValue={defaultValue}
      options={options}
      onChange={(e, { value }) => onSelect(e, value)}
    />
  );
};

LanguageSelector.propTypes = {
  onSelect: PropTypes.func,
  defaultValue: PropTypes.string,
  languages: PropTypes.arrayOf(PropTypes.string),
  t: PropTypes.func.isRequired,
};

LanguageSelector.defaultProps = {
  onSelect: noop,
  defaultValue: LANG_HEBREW,
  languages: [],
};

export default translate()(LanguageSelector);
