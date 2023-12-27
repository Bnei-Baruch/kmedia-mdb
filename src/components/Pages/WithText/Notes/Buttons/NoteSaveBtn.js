import React from 'react';
import { Button } from 'semantic-ui-react';
import { useDispatch, batch, useSelector } from 'react-redux';
import { actions, NOTE_STATUS, selectors } from '../../../../../redux/modules/myNotes';
import { useTranslation } from 'react-i18next';

const NoteSaveBtn = () => {
  const note     = useSelector(state => selectors.getSelected(state.notes));
  const dispatch = useDispatch();
  const { t }    = useTranslation();

  const handleSave = () => {
    if (!note.id) {
      dispatch(actions.addServer(note.content, note));
    } else {
      dispatch(actions.editServer(note.content, note.id));
    }
  };

  return (
    <Button
      onClick={handleSave}
      color="blue"
      content={t('buttons.save')}
    />
  );
};

export default NoteSaveBtn;
