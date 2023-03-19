import React from 'react';
import ContentItemContainer from '../../../shared/ContentItem/ContentItemContainer';
import { useSelector } from 'react-redux';
import { selectors } from '../../../../redux/modules/playlist';
import { MY_NAMESPACE_PLAYLISTS } from '../../../../helpers/consts';
import { selectors as settings } from '../../../../redux/modules/settings';

const PlaylistItems = () => {
  const language      = useSelector(state => settings.getLanguage(state.settings));
  const cuIds         = useSelector(state => selectors.getPlaylist(state.playlist));
  const { cuId, pId } = useSelector(state => selectors.getInfo(state.playlist));

  return (
    <div id="avbox_playlist" className="avbox__playlist-view">
      {
        cuIds.map((id, i) => {
          const selected = id === cuId;
          return (
            <ContentItemContainer
              key={id}
              id={id}
              size="small"
              asList={true}
              selected={selected}
              link={`/${language}/${MY_NAMESPACE_PLAYLISTS}/${pId}?ap=${i}`}
            />
          );
        })
      }
    </div>
  );
};

export default PlaylistItems;
