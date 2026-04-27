import React from 'react';
import { useDispatch } from 'react-redux';
import { actions, NOTE_STATUS } from '../../../../../redux/modules/myNotes';

const NoteCloseBtn = () => {
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(actions.setStatus(NOTE_STATUS.none));
    dispatch(actions.setSelected(null));
  };

  return (
    <button
      className="clear_button"
      onClick={handleClose}
    >
      <span className="material-symbols-outlined">close</span>
    </button>
  );
};

export default NoteCloseBtn;
