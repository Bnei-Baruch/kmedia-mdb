import React from 'react';
import moment from 'moment/moment';
import NoteEditBtn from './Buttons/NoteEditBtn';
import NoteRemoveBtn from './Buttons/NoteRemoveBtn';
import { useSelector } from 'react-redux';
import { selectors, NOTE_STATUS } from '../../../../redux/modules/myNotes';
import NoteCopyBtn from './Buttons/NoteCopyBtn';
import NoteInModalBtn from './Buttons/NoteInModalBtn';
import NoteContent from './NoteContent';

const NoteItemSticky = () => {
  const note   = useSelector(state => selectors.getSelected(state.notes));
  const status = useSelector(state => selectors.getStatus(state.notes));

  if (!note || (status !== NOTE_STATUS.none && status !== NOTE_STATUS.edit)) return null;

  return (
    <div className="note_item note_item_sticky">
      <div className="note_info">
        <div className="note_buttons">
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
