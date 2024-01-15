import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Popup } from 'semantic-ui-react';
import { useSelector } from 'react-redux';
import { settingsGetUIDirSelector } from '../../../redux/selectors';

const PlayByTextBtn = ({ handlePlay }) => {

  const { t } = useTranslation();
  const uiDir = useSelector(settingsGetUIDirSelector);

  return (
    <Popup
      content={t('share-text.play-from-text')}
      dir={uiDir}
      trigger={
        <Button
          circular
          onClick={handlePlay}
          icon="play"
        />
      }
    />
  );
};

export default PlayByTextBtn;
