import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Popup } from 'semantic-ui-react';
import { useSelector, useDispatch } from 'react-redux';
import { actions, selectors as assets } from '../../../../redux/modules/assets';
import { selectors as textPage } from '../../../../redux/modules/textPage';
import { seek, setPip } from '../../../../pkg/jwpAdapter/adapter';

const PlayByTextBtn = () => {
  const { id }        = useSelector(state => textPage.getSubject(state.textPage));
  const { language }  = useSelector(state => textPage.getFile(state.textPage));
  const wordOffset    = useSelector(state => textPage.getWordOffset(state.textPage));
  const hasTimeCode   = useSelector(state => assets.hasTimeCode(state.assets));
  const timeCodeByPos = useSelector(state => assets.getTimeCode(state.assets));

  const { t }    = useTranslation();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actions.fetchTimeCode(id, language));
  }, [id, language]);

  if (!hasTimeCode) return null;

  const handlePlay = () => {
    const startTime = timeCodeByPos(wordOffset - 2);
    seek(startTime).play();
    setPip(true);
  };

  return (
    <Popup
      content={t('share-text.play-from-text')}
      trigger={
        <Button
          onClick={handlePlay}
          icon={<span className="material-symbols-outlined">play_arrow</span>}
        />
      }
    />
  );
};

export default PlayByTextBtn;
