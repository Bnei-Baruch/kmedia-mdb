import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { getLanguageDirection } from '../../../../helpers/i18n-utils';
import { actions, NOTE_STATUS } from '../../../../redux/modules/myNotes';
import NoteCancelBtn from './Buttons/NoteCancelBtn';
import NoteSaveBtn from './Buttons/NoteSaveBtn';
import { myNotesGetSelectedSelector, myNotesGetStatusSelector } from '../../../../redux/selectors';

const NoteContent = () => {
  const note   = useSelector(myNotesGetSelectedSelector);
  const status = useSelector(myNotesGetStatusSelector);

  const dispatch = useDispatch();

  const dir = getLanguageDirection(note.language);

  const handleChange = e => {
    dispatch(actions.setSelected({ ...note, content: e.target.value }));
  };

  const isEdit = status === NOTE_STATUS.edit || status === NOTE_STATUS.editModal;
  return (
    <div className="note_content" dir={dir}>
      {
        !isEdit ? note.content :
          (
            <>
              <textarea value={note.content} onChange={handleChange} className="w-full resize-y border rounded p-2" />
              <div className="note_edit_btns">
                <NoteCancelBtn />
                <NoteSaveBtn />
              </div>
            </>
          )
      }
    </div>

  );
};

export default NoteContent;
