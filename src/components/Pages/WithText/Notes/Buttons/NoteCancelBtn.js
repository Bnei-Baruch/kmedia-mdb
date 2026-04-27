import React from 'react';
import { useDispatch } from 'react-redux';
import { actions, NOTE_STATUS } from '../../../../../redux/modules/myNotes';
import { useTranslation } from 'react-i18next';

const NoteCancelBtn = () => {
  const dispatch = useDispatch();
  const { t }    = useTranslation();

  const handleCancel = () => {
    dispatch(actions.setStatus(NOTE_STATUS.none));
    dispatch(actions.setSelected(null));
  };

  return (
    <button
      onClick={handleCancel}
      className="border border-blue-600 text-blue-600 bg-transparent rounded px-4 py-2 hover:bg-blue-50"
    >
      {t('buttons.cancel')}
    </button>
  );
};

export default NoteCancelBtn;
