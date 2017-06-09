import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'semantic-ui-react';
import { LANG_HEBREW, LANGUAGE_OPTIONS } from '../../helpers/consts';

const LanguageSelector = (props) => {
  const options = LANGUAGE_OPTIONS.filter(x => props.languages.includes(x.value));

  return (
    <Dropdown
      fluid
      item
      labeled
      selection
      scrolling
      defaultValue={props.defaultValue}
      options={options}
      onChange={(e, { value }) => props.onSelect(e, value)}
    />
  );
};

LanguageSelector.propTypes = {
  onSelect: PropTypes.func,
  defaultValue: PropTypes.string,
  languages: PropTypes.arrayOf(PropTypes.string),
};

LanguageSelector.defaultProps = {
  onSelect: () => {
  },
  defaultValue: LANG_HEBREW,
  languages: [],
};

export default LanguageSelector;
