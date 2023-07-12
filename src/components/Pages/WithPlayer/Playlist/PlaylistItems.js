import React, { useContext } from 'react';
import { withTranslation } from 'react-i18next';
import ContentItemContainer from '../../../shared/ContentItem/ContentItemContainer';
import { useSelector, useDispatch } from 'react-redux';
import { selectors, actions } from '../../../../redux/modules/playlist';
import { DeviceInfoContext } from '../../../../helpers/app-contexts';
import { Header, Button, Container } from 'semantic-ui-react';
import { selectors as mdb } from '../../../../redux/modules/mdb';
import { COLLECTION_DAILY_LESSONS } from '../../../../helpers/consts';

let timer;
const PlaylistItems = ({ t }) => {
  const { isMobileDevice } = useContext(DeviceInfoContext);

  const { cId, cuId }          = useSelector(state => selectors.getInfo(state.playlist));
  const { from, to }           = useSelector(state => selectors.getFetched(state.playlist));
  const items                  = useSelector(state => selectors.getPlaylist(state.playlist));
  const { name, content_type } = useSelector(state => mdb.getDenormCollection(state.mdb, cId)) || false;
  const title                  = COLLECTION_DAILY_LESSONS.includes(content_type) ? t('constants.content-types.DAILY_LESSON') : name;

  const dispatch       = useDispatch();
  const handleLoadMore = dir => dispatch(actions.fetchShowData(dir));
  const handleScroll   = e => {
    if (timer !== null) clearTimeout(timer);
    timer = setTimeout(function () {
      const idx = from + Math.max(0, Math.round(e.target.scrollTop / (isMobileDevice ? 128 : 104)));
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

export default withTranslation()(PlaylistItems);
