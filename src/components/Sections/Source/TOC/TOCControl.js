import React from 'react';
import { useDispatch } from 'react-redux';
import { actions } from '../../../../redux/modules/textPage';
import TocToggleBtn from './TocToggleBtn';

const TocControl = ({ textKey }) => {
  const dispatch    = useDispatch();
  const handleClose = () => dispatch(actions.setTocIsActive());

  return (
    <div className="toc_control">
      <TocToggleBtn withText={false} textKey={textKey} />
      <button
        className="toc_close clear_button border border-gray-300 rounded bg-white hover:bg-gray-50 p-1"
        onClick={handleClose}
      >
        <span className="material-symbols-outlined">close</span>
      </button>
    </div>

  );
};

export default TocControl;
