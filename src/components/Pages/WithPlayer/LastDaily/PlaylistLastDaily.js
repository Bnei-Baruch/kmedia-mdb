import React from 'react';
import { useTranslation } from 'react-i18next';

import Helmets from '../../../shared/Helmets';
import { publicFile } from '../../../../helpers/utils';
import PlaylistPage from '../Playlist/PlaylistPage';
import BuildPlaylistLastDaily from './BuildPlaylistLastDaily';
import { useSelector } from 'react-redux';
import { getWipErr } from '../../../shared/WipErr/WipErr';
import { playlistGetInfoSelector } from '../../../../redux/selectors';

const PlaylistLastDaily = ({ playerContainer }) => {
  const { t }                        = useTranslation();
  const { isReady: isPlaylistReady } = useSelector(playlistGetInfoSelector);
  const wipErr                       = getWipErr(!isPlaylistReady, null);

  return (
    <div>
      <Helmets.Basic title={t('lessons.last.title')} description={t('lessons.last.description')}/>
      <Helmets.Image unitOrUrl={publicFile('seo/last_lesson.jpg')}/>
      <BuildPlaylistLastDaily/>
      {
        wipErr || (<PlaylistPage playerContainer={playerContainer}/>)
      }
    </div>
  );
};

export default PlaylistLastDaily;
