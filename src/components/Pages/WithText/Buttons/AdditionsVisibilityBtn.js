import React from 'react';
import { Button } from 'semantic-ui-react';
import { useSelector, useDispatch } from 'react-redux';
import { actions } from '../../../../redux/modules/textPage';
import { textPageGetTextOnlySelector } from '../../../../redux/selectors';

const AdditionsVisibilityBtn = () => {
  const textOnly = useSelector(textPageGetTextOnlySelector);
  const dispatch = useDispatch();
  const handle   = () => {
    dispatch(actions.toggleTextOnly());
  };

  return (
    <Button
      onClick={handle}
      active={textOnly}
      icon={<span className="material-symbols-outlined">visibility_off</span>}
    />
  );
};

export default AdditionsVisibilityBtn;
