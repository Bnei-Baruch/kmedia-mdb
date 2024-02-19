import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { actions } from '../../../../redux/modules/textPage';
import { textPageGetTextOnlySelector } from '../../../../redux/selectors';
import ToolbarBtnTooltip from './ToolbarBtnTooltip';

const AdditionsVisibilityBtn = () => {
  const dispatch = useDispatch();

  const textOnly = useSelector(textPageGetTextOnlySelector);

  const toggle = () => dispatch(actions.toggleTextOnly());

  return (
    <ToolbarBtnTooltip
      textKey={textOnly ? 'hide-additions' : 'show-additions'}
      onClick={toggle}
      active={textOnly}
      icon={<span className="material-symbols-outlined">visibility_off</span>}
    />
  );
};

export default AdditionsVisibilityBtn;
