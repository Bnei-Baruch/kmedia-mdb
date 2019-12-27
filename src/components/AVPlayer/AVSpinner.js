import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'semantic-ui-react';

const AVSpinner = ({ isLoading }) => {
  return isLoading
    ? <Icon
      loading
      name="spinner"
      color="grey"
      size="huge"
    />
    : null;
}

AVSpinner.propTypes = {
  isLoading: PropTypes.bool.isRequired
}

export default React.memo(AVSpinner);
