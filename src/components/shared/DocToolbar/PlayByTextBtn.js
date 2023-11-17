import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Popup } from 'semantic-ui-react';
import { useSelector } from 'react-redux';
import { selectors as settings } from '../../../redux/modules/settings';

const PlayByTextBtn = ({ handlePlay }) => {

  const { t } = useTranslation();
  const uiDir = useSelector(state => settings.getUIDir(state.settings));

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
