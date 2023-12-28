import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button, Icon, Menu, Popup, Search } from 'semantic-ui-react';
import debounce from 'lodash/debounce';
import { actions, selectors as textPage } from '../../../../redux/modules/textPage';
import { useDispatch, useSelector } from 'react-redux';

const ToggleScanBtn = () => {
  const { on, file } = useSelector(state => textPage.getScanInfo(state.textPage));
  const dispatch     = useDispatch();

  if (!file) return null;

  const handle = () => dispatch(actions.toggleScan());

  return (
    <Button
      compact
      size="small"
      active={on}
      onClick={handle}
      icon={<span className="material-symbols-outlined">image</span>}
    />
  );
};

export default ToggleScanBtn;
