import React from 'react';
import { Button } from 'semantic-ui-react';
import { useDispatch } from 'react-redux';
import { actions, NOTE_STATUS } from '../../../../../redux/modules/myNotes';

const NoteRemoveBtn = () => {
  const dispatch     = useDispatch();
  const handleRemove = () => {
    dispatch(actions.setStatus(NOTE_STATUS.remove));
  };

  return (
    <Button
      basic
      className="clear_button"
      onClick={handleRemove}
      icon={
        <span className="material-symbols-outlined">delete</span>
      }
    />
  );
};

export default NoteRemoveBtn;
