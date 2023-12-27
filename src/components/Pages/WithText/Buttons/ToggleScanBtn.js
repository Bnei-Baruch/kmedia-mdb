import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button, Icon, Menu, Popup, Search } from 'semantic-ui-react';
import debounce from 'lodash/debounce';
import { actions } from '../../../../redux/modules/textPage';
import { useDispatch } from 'react-redux';

const ToggleScanBtn = () => {

  const dispatch = useDispatch();
  const handle   = () => {
    dispatch(actions.toggleScan());
  };
  return (
    <Button
      compact
      size="small"
      onClick={handle}
      icon={<span className="material-symbols-outlined">image</span>}
    />
  );
};

export default ToggleScanBtn;
