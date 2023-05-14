import React from 'react';
import ContentItemContainer from '../../../shared/ContentItem/ContentItemContainer';
import { useSelector } from 'react-redux';
import { selectors } from '../../../../redux/modules/playlist';
import { MY_NAMESPACE_PLAYLISTS } from '../../../../helpers/consts';
import { selectors as settings } from '../../../../redux/modules/settings';
import { stringify } from '../../../../helpers/url';

const PlaylistItems = () => {
  const language    = useSelector(state => settings.getLanguage(state.settings));
  const itemsIds    = useSelector(state => selectors.getPlaylist(state.playlist));
  const { id, pId } = useSelector(state => selectors.getInfo(state.playlist));
  const itemById    = useSelector(state => selectors.getItemById(state.playlist));

  return (
    <div id="avbox_playlist" className="avbox__playlist-view">
      {
        itemsIds.map((_id, i) => {
          const selected                   = _id === id;
          const { name, cuId, properties } = itemById(_id);
          const params                     = stringify({ ...properties, ap: i });
          return (
            <ContentItemContainer
              key={_id}
              id={cuId}
              size="small"
              asList={true}
              selected={selected}
              name={name}
              link={`/${language}/${MY_NAMESPACE_PLAYLISTS}/${pId}?${params}`}
            />
          );
        })
      }
    </div>
  );
};

export default PlaylistItems;
