import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { actions } from '../../../../redux/modules/my';
import { MY_NAMESPACE_PLAYLISTS } from '../../../../helpers/consts';
import { DeviceInfoContext } from '../../../../helpers/app-contexts';
import PlaylistHeaderMobile from './HeaderMobile';
import PlaylistHeader from './Header';
import { selectors as settings } from '../../../../redux/modules/settings';

const PlaylistHeaderContainer = ({ playlist }) => {
  const { isMobileDevice } = useContext(DeviceInfoContext);
  const history            = useHistory();
  const dispatch           = useDispatch();
  const language           = useSelector(state => settings.getLanguage(state.settings));

  const save = (name) => dispatch(actions.edit(MY_NAMESPACE_PLAYLISTS, { id: playlist.id, name }));

  const confirmSuccess = () => {
    dispatch(actions.remove(MY_NAMESPACE_PLAYLISTS, { ids: [playlist.id] }));
    //wait for remove from server
    setTimeout(() => history.push(`/${language}/personal`), 100);
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

export default PlaylistHeaderContainer;
