import React from 'react';
import ContentItemContainer from '../../../shared/ContentItem/ContentItemContainer';
import { useSelector } from 'react-redux';
import { selectors } from '../../../../redux/modules/playlist';
import { MY_NAMESPACE_PLAYLISTS } from '../../../../helpers/consts';
import { selectors as settings } from '../../../../../lib/redux/slices/settingsSlice/settingsSlice';
import { stringify } from '../../../../helpers/url';

const PlaylistItems = () => {
  const items       = useSelector(state => selectors.getPlaylist(state.playlist));
  const uiLang      = useSelector(state => settings.getUILang(state.settings));
  const { id, pId } = useSelector(state => selectors.getInfo(state.playlist));
  const itemById    = useSelector(state => selectors.getItemById(state.playlist));

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
