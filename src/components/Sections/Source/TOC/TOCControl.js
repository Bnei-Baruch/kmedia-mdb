import React from 'react';
import { Button } from 'semantic-ui-react';
import { useDispatch } from 'react-redux';
import { actions } from '../../../../redux/modules/textPage';
import TocToggleBtn from './TocToggleBtn';

const TocControl = ({textKey}) => {
  const dispatch    = useDispatch();
  const handleClose = () => dispatch(actions.setTocIsActive());

  return (
    <div className="toc_control">
      <TocToggleBtn withText={false} textKey={textKey} />
      <Button
        basic
        className="toc_close clear_button"
        icon={<span className="material-symbols-outlined">close</span>}
        onClick={handleClose}
      />
    </div>

  );
};

export default TocControl;
