import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, TextArea, Icon } from 'semantic-ui-react';
import { getLanguageDirection } from '../../../../helpers/i18n-utils';
import moment from 'moment/moment';
import NoteEditBtn from './Buttons/NoteEditBtn';
import NoteRemoveBtn from './Buttons/NoteRemoveBtn';
import { useSelector, useDispatch, batch } from 'react-redux';
import { selectors, actions, NOTE_STATUS } from '../../../../redux/modules/myNotes';
import NoteCopyBtn from './Buttons/NoteCopyBtn';
import NoteInModalBtn from './Buttons/NoteInModalBtn';
import NoteCancelBtn from './Buttons/NoteCancelBtn';
import NoteSaveBtn from './Buttons/NoteSaveBtn';

const NoteContent = () => {
  const note   = useSelector(state => selectors.getSelected(state.notes));
  const status = useSelector(state => selectors.getStatus(state.notes));

  const dispatch = useDispatch();

  const dir = getLanguageDirection(note.language);

  const handleChange = (e, { value }) => {
    dispatch(actions.setSelected({ ...note, content: value }));
  };

  const isEdit       = status === NOTE_STATUS.edit || status === NOTE_STATUS.editModal;

  return (
    <div className="note_content" dir={dir}>
      {
        !isEdit ? note.content : (
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
