import React from 'react';
import ContentItemContainer from '../../../shared/ContentItem/ContentItemContainer';
import { useSelector } from 'react-redux';
import { MY_NAMESPACE_PLAYLISTS } from '../../../../helpers/consts';
import { stringify } from '../../../../helpers/url';
import { playlistGetInfoSelector, playlistGetItemByIdSelector, playlistGetPlaylistSelector, settingsGetUILangSelector } from '../../../../redux/selectors';

const PlaylistItems = () => {
  const items       = useSelector(playlistGetPlaylistSelector);
  const uiLang      = useSelector(settingsGetUILangSelector);
  const { id, pId } = useSelector(playlistGetInfoSelector);
  const itemById    = useSelector(playlistGetItemByIdSelector);

  return (
    <div id="avbox_playlist" className="avbox__playlist-view">
      {
        items.map(({ id: _id, showImg }) => {
          const selected                       = _id === id;
          const { name, cuId, properties, ap } = itemById(_id);
          if (!cuId) return null;

          const search = stringify({ ...properties, ap });
          return (
            <ContentItemContainer
              key={_id}
              id={cuId}
              size="small"
              asList={true}
              selected={selected}
              name={name}
              link={{ pathname: `/${uiLang}/${MY_NAMESPACE_PLAYLISTS}/${pId}`, search }}
              showImg={showImg}
            />
          );
        })
      }
    </div>
  );
};

export default PlaylistItems;
