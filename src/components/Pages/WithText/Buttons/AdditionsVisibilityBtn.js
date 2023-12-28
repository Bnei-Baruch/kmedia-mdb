import React from 'react';
import { Button } from 'semantic-ui-react';
import { useSelector, useDispatch } from 'react-redux';
import { selectors as textPage, actions } from '../../../../redux/modules/textPage';

const AdditionsVisibilityBtn = () => {
  const textOnly = useSelector(state => textPage.getTextOnly(state.textPage));
  const dispatch = useDispatch();
  const handle   = () => {
    dispatch(actions.toggleTextOnly());
  };

  return (
    <Button
      compact
      size="small"
      onClick={handle}
      active={textOnly}
      icon={
        <span className="material-symbols-outlined">
          visibility_off
        </span>
      }
    />
  );
};

export default AdditionsVisibilityBtn;
