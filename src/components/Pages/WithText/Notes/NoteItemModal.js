import React from 'react';
import { Modal } from 'semantic-ui-react';
import { getLanguageDirection } from '../../../../helpers/i18n-utils';
import moment from 'moment/moment';
import NoteEditBtn from './Buttons/NoteEditBtn';
import NoteRemoveBtn from './Buttons/NoteRemoveBtn';
import { useSelector } from 'react-redux';
import { selectors, NOTE_STATUS } from '../../../../redux/modules/myNotes';
import NoteCopyBtn from './Buttons/NoteCopyBtn';
import NoteCancelBtn from './Buttons/NoteCancelBtn';
import NoteSaveBtn from './Buttons/NoteSaveBtn';
import NoteContent from './NoteContent';
import NoteInModalBtn from './Buttons/NoteInModalBtn';

const NoteItemSticky = () => {
  const note   = useSelector(state => selectors.getSelected(state.notes));
  const status = useSelector(state => selectors.getStatus(state.notes));

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
