import React, { useContext } from 'react';
import { withTranslation } from 'react-i18next';
import ContentItemContainer from '../../../shared/ContentItem/ContentItemContainer';
import { useSelector } from 'react-redux';
import { selectors } from '../../../../redux/modules/playlist';
import { DeviceInfoContext } from '../../../../helpers/app-contexts';
import { Header } from 'semantic-ui-react';
import { selectors as mdb } from '../../../../redux/modules/mdb';
import { COLLECTION_DAILY_LESSONS } from '../../../../helpers/consts';

const PlaylistItems = ({ t }) => {
  const { isMobileDevice } = useContext(DeviceInfoContext);

  const cuIds                  = useSelector(state => selectors.getPlaylist(state.playlist));
  const { cId, cuId }          = useSelector(state => selectors.getInfo(state.playlist));
  const { name, content_type } = useSelector(state => mdb.getDenormCollection(state.mdb, cId)) || false;
  const title                  = COLLECTION_DAILY_LESSONS.includes(content_type) ? t('constants.content-types.DAILY_LESSON') : name;

  return (
    <div id="avbox_playlist" className="avbox__playlist-view">
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
        cuIds.map((id, i) => {
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
            />
          );
        })
      }
    </div>
  );
};

export default withTranslation()(PlaylistItems);
