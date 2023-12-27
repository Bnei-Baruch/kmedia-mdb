import React from 'react';
import { getLanguageDirection } from '../../../../helpers/i18n-utils';
import moment from 'moment/moment';
import NoteEditBtn from './Buttons/NoteEditBtn';
import NoteRemoveBtn from './Buttons/NoteRemoveBtn';
import { useDispatch } from 'react-redux';
import { actions } from '../../../../redux/modules/myNotes';
import NoteCopyBtn from './Buttons/NoteCopyBtn';
import NoteInModalBtn from './Buttons/NoteInModalBtn';

const NoteItemInList = ({ note }) => {
  const dispatch = useDispatch();
  const dir      = getLanguageDirection(note.language);

  const handleSelect = () => dispatch(actions.setSelected(note));

  return (
    <div className="note_item" onClick={handleSelect}>
      <div className="note_info">
        <div className="note_buttons">
          <NoteInModalBtn />
          <NoteEditBtn />
          <NoteCopyBtn text={note.content} />
          <NoteRemoveBtn />
        </div>

        <span>{moment.utc(note.created_at).format('YYYY-MM-DD')}</span>
      </div>
      <div className="note_content note_content_short" dir={dir}>
        {note.content}
      </div>
    </div>

  );
};

export default NoteItemInList;
