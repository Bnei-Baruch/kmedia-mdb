import React from 'react';
import { Button } from 'semantic-ui-react';
import { useDispatch, useSelector } from 'react-redux';
import { actions, selectors } from '../../../../../redux/modules/myNotes';
import { useTranslation } from 'react-i18next';

const NoteSaveBtn = () => {
  const note     = useSelector(state => selectors.getSelected(state.myNotes));
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
    <Button
      onClick={handleSave}
      color="blue"
      content={t('buttons.save')}
    />
  );
};

export default NoteSaveBtn;
