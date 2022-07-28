import React, { useContext } from 'react';
import { withNamespaces } from 'react-i18next';
import ContentItemContainer from '../../../shared/ContentItem/ContentItemContainer';
import { useSelector } from 'react-redux';
import { selectors } from '../../../../redux/modules/playlist';
import { DeviceInfoContext } from '../../../../helpers/app-contexts';
import { Header } from 'semantic-ui-react';
import { selectors as mdb } from '../../../../redux/modules/mdb';

const PlaylistWidget = ({ t }) => {

  const { isMobileDevice } = useContext(DeviceInfoContext);

  const cuIds                  = useSelector(state => selectors.getPlaylist(state.playlist));
  const { cId, played }        = useSelector(state => selectors.getInfo(state.playlist));
  const { name, content_type } = useSelector(state => mdb.getDenormCollection(state.mdb, cId)) || false;

  return (
    <div id="avbox_playlist" className="avbox__playlist-view">
      {
        !isMobileDevice && (
          <Header
            as="h3"
            className="avbox__playlist-header h3"
            content={name || t(`playlist.title-by-type.${content_type}`)}
          />
        )
      }
      {
        cuIds.map((id, i) => (
          <ContentItemContainer
            key={id}
            id={id}
            ccuId={cId}
            size="small"
            asList={true}
            selected={i === played}
          />
        ))
      }
    </div>
  );
};

export default withNamespaces()(PlaylistWidget);
