import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import ContentItemContainer from '../../../shared/ContentItem/ContentItemContainer';
import { useSelector, useDispatch } from 'react-redux';
import { actions } from '../../../../redux/modules/playlist';
import { DeviceInfoContext } from '../../../../helpers/app-contexts';
import { Header, Button, Container } from 'semantic-ui-react';
import { COLLECTION_DAILY_LESSONS } from '../../../../helpers/consts';
import WipErr from '../../../shared/WipErr/WipErr';
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

  if (!isReady) return WipErr({ wip: !isReady, t });

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
          <Header
            as="h3"
            className="avbox__playlist-header h3"
            content={title || t(`playlist.title-by-type.${content_type}`)}
          />
        )
      }

      {
        from > 0 && (
          <Container fluid>
            <Button
              icon={'arrow up'}
              onClick={() => handleLoadMore(-1)}
              fluid
            />
          </Container>
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
          <Container fluid>
            <Button
              icon={'arrow down'}
              onClick={() => handleLoadMore(1)}
              fluid
            />
          </Container>
        )
      }
    </div>
  );
};

export default PlaylistItems;
