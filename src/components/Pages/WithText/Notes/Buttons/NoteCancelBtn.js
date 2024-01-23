import React from 'react';
import { Button } from 'semantic-ui-react';
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
    <Button
      inverted
      onClick={handleCancel}
      color="blue"
      content={t('buttons.cancel')}
    />
  );
};

export default NoteCancelBtn;
