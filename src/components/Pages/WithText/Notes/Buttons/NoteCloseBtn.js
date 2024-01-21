import React from 'react';
import { Button } from 'semantic-ui-react';
import { useDispatch, batch } from 'react-redux';
import { actions, NOTE_STATUS } from '../../../../../redux/modules/myNotes';

const NoteCloseBtn = () => {
  const dispatch = useDispatch();

  const handleClose = () => {
    batch(() => {
      dispatch(actions.setStatus(NOTE_STATUS.none));
      dispatch(actions.setSelected(null));
    });
  };

  return (
    <Button
      basic
      className="clear_button"
      onClick={handleClose}
      icon={
        <span className="material-symbols-outlined">close</span>
      }
    />
  );
};

export default NoteCloseBtn;
