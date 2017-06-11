import React from 'react';
import PropTypes from 'prop-types';
import { Label, Icon } from 'semantic-ui-react';

const FilterTag = props => (
  <Label as="a">
    <Icon name={props.icon} />
    {props.label}
    <Icon name="close" onClick={props.onClose} />
  </Label>
);

FilterTag.propTypes = {
  icon: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired
};

export default FilterTag;
