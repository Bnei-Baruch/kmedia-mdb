import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { actions } from '../../../../../redux/modules/myNotes';
import { myNotesGetSelectedSelector } from '../../../../../redux/selectors';

const NoteSaveBtn = () => {
  const note     = useSelector(myNotesGetSelectedSelector);
  const dispatch = useDispatch();
  const { t }    = useTranslation();

  const handleSave = () => {
    if (!note.id) {
      dispatch(actions.add(note.content, note));
    } else {
      dispatch(actions.edit(note.content, note.id));
    }
  };

  return (
    <button
      onClick={handleSave}
      className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700"
    >
      {t('buttons.save')}
    </button>
  );
};

export default NoteSaveBtn;
