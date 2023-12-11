import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { selectors as player } from '../../../redux/modules/player';
import { selectors as playlist, actions as playlistActions } from '../../../redux/modules/playlist';
import MenuLanguageSelector from '../../Language/Selector/MenuLanguageSelector';

const PlayerLanguages = () => {
  const { languages = [], isHLS } = useSelector(state => playlist.getPlayed(state.playlist));
  let { language }                = useSelector(state => playlist.getInfo(state.playlist));
  const file                      = useSelector(state => player.getFile(state.player));
  const dispatch                  = useDispatch();

  if (!isHLS) {
    language = file.language;
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
