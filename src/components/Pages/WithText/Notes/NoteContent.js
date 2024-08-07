import React from 'react';
import { TextArea } from 'semantic-ui-react';
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

  const handleChange = (e, { value }) => {
    dispatch(actions.setSelected({ ...note, content: value }));
  };

  const isEdit = status === NOTE_STATUS.edit || status === NOTE_STATUS.editModal;
  return (
    <div className="note_content" dir={dir}>
      {
        !isEdit ? note.content :
          (
            <>
              <TextArea value={note.content} onChange={handleChange} />
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
