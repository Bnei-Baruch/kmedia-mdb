import React from 'react';
import { useTranslation } from 'react-i18next';
import { Confirm } from 'semantic-ui-react';
import { getLanguageDirection } from '../../../../helpers/i18n-utils';
import { useSelector, useDispatch } from 'react-redux';
import { actions, NOTE_STATUS } from '../../../../redux/modules/myNotes';
import { myNotesGetSelectedSelector, myNotesGetStatusSelector } from '../../../../redux/selectors';

const NoteConfirmRemove = () => {
  const { t }  = useTranslation();
  const note   = useSelector(myNotesGetSelectedSelector);
  const status = useSelector(myNotesGetStatusSelector);

  const dispatch = useDispatch();

  if (!note || status !== NOTE_STATUS.remove) return null;

  const dir = getLanguageDirection(note.language);

  const handleRemove = () => {
    dispatch(actions.remove(note.id));
  };

  const handleCancel = () => {
    dispatch(actions.setStatus(NOTE_STATUS.edit));
  };

  return (
    <Confirm
      open={true}
      onConfirm={handleRemove}
      onCancel={handleCancel}
      content={t('messages.confirm-remove-note')}
      confirmButton={t('buttons.remove')}
      cancelButton={t('buttons.cancel')}
      dir={dir}
    />
  );
};

export default NoteConfirmRemove;
