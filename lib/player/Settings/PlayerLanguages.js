import React from 'react';
import { Button, Icon, Menu } from 'semantic-ui-react';
import { useSelector, useDispatch } from 'react-redux';

import { actions, selectors as player } from '../../redux/slices/playerSlice/playerSlice';
import { selectors as playlist } from '../../redux/slices/playlistSlice/playlistSlice';
import { actions as playlistActions, selectors as playlistSelectors } from '../../redux/slices/playlistSlice/playlistSlice';
import { withTranslation } from 'next-i18next';
import MenuLanguageSelector from '../../../src/components/Language/Selector/MenuLanguageSelector';

const PlayerLanguages = () => {
  const { languages = [], isHLS } = useSelector(state => playlist.getPlayed(state.playlist));
  let { language }                = useSelector(state => playlist.getInfo(state.playlist));
  const file                      = useSelector(state => player.getFile(state.player));
  const dispatch           = useDispatch();

  if (!isHLS) {
    language = file.language;
  } else if (!languages.includes(language)) {
    language = languages[0];
  }

  const handleSelect = (lang) => {
    dispatch(playlistActions.setLanguage(lang));
  }

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
