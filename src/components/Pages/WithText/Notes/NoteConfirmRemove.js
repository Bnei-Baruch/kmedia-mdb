import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, TextArea, Icon, Confirm } from 'semantic-ui-react';
import { getLanguageDirection } from '../../../../helpers/i18n-utils';
import moment from 'moment/moment';
import NoteEditBtn from './Buttons/NoteEditBtn';
import NoteRemoveBtn from './Buttons/NoteRemoveBtn';
import { useSelector, useDispatch, batch } from 'react-redux';
import { selectors, actions, NOTE_STATUS } from '../../../../redux/modules/myNotes';
import NoteCopyBtn from './Buttons/NoteCopyBtn';

const NoteConfirmRemove = () => {
  const { t }  = useTranslation();
  const note   = useSelector(state => selectors.getSelected(state.notes));
  const status = useSelector(state => selectors.getStatus(state.notes));

  const dispatch = useDispatch();

  if (!note || status !== NOTE_STATUS.remove) return null;

  const dir = getLanguageDirection(note.language);

  const handleRemove = () => {
    dispatch(actions.removeServer(note.id));
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
