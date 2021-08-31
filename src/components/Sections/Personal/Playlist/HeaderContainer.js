import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import PropTypes from 'prop-types';

import { actions } from '../../../../redux/modules/my';
import { MY_NAMESPACE_PLAYLISTS } from '../../../../helpers/consts';
import { DeviceInfoContext } from '../../../../helpers/app-contexts';
import PlaylistHeaderMobile from './HeaderMobile';
import PlaylistHeader from './Header';

const PlaylistHeaderContainer = ({ playlist, language }) => {
  const { isMobileDevice } = useContext(DeviceInfoContext);
  const history            = useHistory();
  const dispatch           = useDispatch();

  const save = (name) => dispatch(actions.edit(MY_NAMESPACE_PLAYLISTS, { id: playlist.id, name }));

  const confirmSuccess = () => {
    dispatch(actions.remove(MY_NAMESPACE_PLAYLISTS, { ids: [playlist.id] }));
    //wait for remove from server
    setTimeout(() => history.push(`/${language}/${MY_NAMESPACE_PLAYLISTS}`), 100);
  };
  if (!playlist) return null;

  const props = {
    confirmSuccess,
    save,
    playlist
  };
  return isMobileDevice ? <PlaylistHeaderMobile {...props} /> : <PlaylistHeader {...props} />;
};

PlaylistHeaderContainer.propTypes = {
  playlist: PropTypes.object.isRequired
};

export default withNamespaces()(PlaylistHeaderContainer);
