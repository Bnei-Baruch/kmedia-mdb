import React from 'react';
import moment from 'moment/moment';
import NoteEditBtn from './Buttons/NoteEditBtn';
import NoteRemoveBtn from './Buttons/NoteRemoveBtn';
import { useSelector } from 'react-redux';
import { NOTE_STATUS } from '../../../../redux/modules/myNotes';
import NoteCopyBtn from './Buttons/NoteCopyBtn';
import NoteInModalBtn from './Buttons/NoteInModalBtn';
import NoteContent from './NoteContent';
import NoteCloseBtn from './Buttons/NoteCloseBtn';
import { myNotesGetSelectedSelector, myNotesGetStatusSelector } from '../../../../redux/selectors';

const NoteItemSticky = () => {
  const note   = useSelector(myNotesGetSelectedSelector);
  const status = useSelector(myNotesGetStatusSelector);

  if (!note || (status !== NOTE_STATUS.none && status !== NOTE_STATUS.edit)) return null;

  return (
    <div className="note_item note_item_sticky">
      <div className="note_info">
        <div className="note_buttons">
          <NoteCloseBtn />
          <NoteInModalBtn />
          <NoteEditBtn />
          <NoteCopyBtn text={note.content} />
          <NoteRemoveBtn />
        </div>

        <span>{moment.utc(note.created_at).format('YYYY-MM-DD')}</span>
      </div>
      <NoteContent />
    </div>

  );
};

export default NoteItemSticky;
