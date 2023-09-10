import React from 'react';
import { useTranslation } from 'next-i18next';
import { Button, Popup } from 'semantic-ui-react';
import { getLanguageDirection } from '../../../helpers/i18n-utils';
import { useSelector } from 'react-redux';
import { selectors as settings } from '../../../../lib/redux/slices/settingsSlice/settingsSlice';

const PlayByTextBtn = ({ handlePlay }) => {

  const { t }    = useTranslation();
  const language = useSelector(state => settings.getLanguage(state.settings));
  const dir      = getLanguageDirection(language);

  return (
      <Popup
        content={t('share-text.play-from-text')}
        dir={dir}
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
