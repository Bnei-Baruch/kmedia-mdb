import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { actions as playlistActions } from '../../../redux/modules/playlist';
import MenuLanguageSelector from '../../Language/Selector/MenuLanguageSelector';
import { playerGetFileSelector, playlistGetInfoSelector, playlistGetPlayedSelector } from '../../../redux/selectors';

const PlayerLanguages = () => {
  const { languages = [], isHLS } = useSelector(playlistGetPlayedSelector);
  let { language }                = useSelector(playlistGetInfoSelector);
  const file                      = useSelector(playerGetFileSelector);
  const dispatch                  = useDispatch();

  if (!isHLS) {
    ({ language } = file);
  } else if (!languages.includes(language)) {
    language = languages[0];
  }

  const handleSelect = lang => {
    dispatch(playlistActions.setLanguage(lang));
  };

  return (
    <div className="controls__language">
      <MenuLanguageSelector
        languages={languages}
        selected={language}
        onLanguageChange={handleSelect}
        multiSelect={false}
        upward={true}
      />
    </div>
  );
};

export default PlayerLanguages;
