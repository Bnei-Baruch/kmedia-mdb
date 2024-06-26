import React from 'react';
import { Modal } from 'semantic-ui-react';
import { getLanguageDirection } from '../../../../helpers/i18n-utils';
import moment from 'moment/moment';
import { useSelector } from 'react-redux';

import NoteEditBtn from './Buttons/NoteEditBtn';
import NoteRemoveBtn from './Buttons/NoteRemoveBtn';
import { NOTE_STATUS } from '../../../../redux/modules/myNotes';
import NoteCopyBtn from './Buttons/NoteCopyBtn';
import NoteContent from './NoteContent';
import NoteInModalBtn from './Buttons/NoteInModalBtn';
import NoteCloseBtn from './Buttons/NoteCloseBtn';
import { myNotesGetSelectedSelector, myNotesGetStatusSelector } from '../../../../redux/selectors';

const NoteItemSticky = () => {
  const note   = useSelector(myNotesGetSelectedSelector);
  const status = useSelector(myNotesGetStatusSelector);

  if (!note || (status !== NOTE_STATUS.editModal && status !== NOTE_STATUS.modal)) return null;

  const dir = getLanguageDirection(note.language);

  return (
    <Modal
      size="large"
      open={true}
      dir={dir}
      className="note_modal note_item"
      closeOnDimmerClick={false}
    >
      <Modal.Content>
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
      </Modal.Content>
    </Modal>

  );
};

export default NoteItemSticky;
