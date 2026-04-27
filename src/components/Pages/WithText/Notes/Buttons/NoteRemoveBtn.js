import React from 'react';
import { useDispatch } from 'react-redux';
import { actions, NOTE_STATUS } from '../../../../../redux/modules/myNotes';

const NoteRemoveBtn = () => {
  const dispatch     = useDispatch();
  const handleRemove = () => {
    dispatch(actions.setStatus(NOTE_STATUS.remove));
  };

  return (
    <button
      className="clear_button"
      onClick={handleRemove}
    >
      <span className="material-symbols-outlined">delete</span>
    </button>
  );
};

export default NoteRemoveBtn;
