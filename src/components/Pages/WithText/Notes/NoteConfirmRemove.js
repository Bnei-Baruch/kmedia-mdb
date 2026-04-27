import React from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog } from '@headlessui/react';
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
    <Dialog open={true} onClose={handleCancel} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" />
      <div className="fixed inset-0 flex items-center justify-center">
        <Dialog.Panel className="mx-auto max-w-sm rounded bg-white p-6" dir={dir}>
          <div className="mt-2">{t('messages.confirm-remove-note')}</div>
          <div className="mt-4 flex justify-end gap-2">
            <button
              className="rounded border border-gray-300 px-4 py-2 hover:bg-gray-50"
              onClick={handleCancel}
            >
              {t('buttons.cancel')}
            </button>
            <button
              className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              onClick={handleRemove}
            >
              {t('buttons.remove')}
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default NoteConfirmRemove;
