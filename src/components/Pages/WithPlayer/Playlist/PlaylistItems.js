import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import ContentItemContainer from '../../../shared/ContentItem/ContentItemContainer';
import { useSelector, useDispatch } from 'react-redux';
import { actions } from '../../../../redux/modules/playlist';
import { DeviceInfoContext } from '../../../../helpers/app-contexts';
import { COLLECTION_DAILY_LESSONS } from '../../../../helpers/consts';
import { getWipErr } from '../../../shared/WipErr/WipErr';
import {
  mdbGetDenormCollectionSelector,
  playlistGetFetchedSelector,
  playlistGetInfoSelector,
  playlistGetPlaylistSelector
} from '../../../../redux/selectors';

const PLAYLIST_ITEM_HEIGHT        = 104;
const PLAYLIST_ITEM_HEIGHT_MOBILE = 128;
let timer;

const PlaylistItems               = () => {
  const { isMobileDevice } = useContext(DeviceInfoContext);
  const { t }              = useTranslation();

  const { cId, cuId, isReady } = useSelector(playlistGetInfoSelector);
  const { from, to }           = useSelector(playlistGetFetchedSelector);
  const items                  = useSelector(playlistGetPlaylistSelector);
  const { name, content_type } = useSelector(state => mdbGetDenormCollectionSelector(state, cId)) || false;
  const title                  = COLLECTION_DAILY_LESSONS.includes(content_type) ? t('constants.content-types.DAILY_LESSON') : name;
  const dispatch               = useDispatch();

  if (!isReady) return getWipErr(!isReady, null);

  const handleLoadMore = dir => dispatch(actions.fetchShowData(dir));
  const handleScroll   = e => {
    if (timer !== null) clearTimeout(timer);
    timer = setTimeout(() => {
      const h   = isMobileDevice ? PLAYLIST_ITEM_HEIGHT_MOBILE : PLAYLIST_ITEM_HEIGHT;
      const idx = from + Math.max(0, Math.round(e.target.scrollTop / h));
      dispatch(actions.showImages(idx));
    }, 150);
  };

  return (
    <div id="avbox_playlist" className="avbox__playlist-view" onScroll={handleScroll}>
      {
        !isMobileDevice && (
          <h3 className="avbox__playlist-header">
            {title || t(`playlist.title-by-type.${content_type}`)}
          </h3>
        )
      }

      {
        from > 0 && (
          <div className="w-full">
            <button
              className="w-full flex items-center justify-center"
              onClick={() => handleLoadMore(-1)}
            >
              <span className="material-symbols-outlined">arrow_upward</span>
            </button>
          </div>
        )
      }
      {
        items.map(({ id, showImg }, i) => {
          if (i < from || i > to)
            return null;
          const selected = id === cuId;
          return (
            <ContentItemContainer
              key={id}
              id={id}
              ccuId={cId}
              size="small"
              asList={true}
              selected={selected}
              withCCUInfo={false}
              showImg={showImg}
            />
          );
        })
      }
      {
        to < items.length - 1 && (
          <div className="w-full">
            <button
              className="w-full flex items-center justify-center"
              onClick={() => handleLoadMore(1)}
            >
              <span className="material-symbols-outlined">arrow_downward</span>
            </button>
          </div>
        )
      }
    </div>
  );
};

export default PlaylistItems;
