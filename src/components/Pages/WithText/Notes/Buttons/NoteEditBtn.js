import React from 'react';
import { Button } from 'semantic-ui-react';
import { useDispatch, useSelector } from 'react-redux';

import { actions, NOTE_STATUS } from '../../../../../redux/modules/myNotes';
import { myNotesGetStatusSelector } from '../../../../../redux/selectors';

const NoteEditBtn = () => {
  const status   = useSelector(myNotesGetStatusSelector);
  const dispatch = useDispatch();

  const active = status === NOTE_STATUS.editModal || status === NOTE_STATUS.edit;

  const handleEdit = () => {
    switch (status) {
      case NOTE_STATUS.modal:
        dispatch(actions.setStatus(NOTE_STATUS.editModal));
        break;
      case NOTE_STATUS.editModal:
        dispatch(actions.setStatus(NOTE_STATUS.modal));
        break;
      case NOTE_STATUS.none:
        dispatch(actions.setStatus(NOTE_STATUS.edit));
        break;
      case NOTE_STATUS.edit:
        dispatch(actions.setStatus(NOTE_STATUS.none));
        break;
      default:
        dispatch(actions.setStatus(NOTE_STATUS.none));
    }
  };

  return (
    <Button
      basic
      active={active}
      className="clear_button"
      onClick={handleEdit}
      icon={
        <span className="material-symbols-outlined">edit</span>
      }
    />
  );
};

export default NoteEditBtn;
