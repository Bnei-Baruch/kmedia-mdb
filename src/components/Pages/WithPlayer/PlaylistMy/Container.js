import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { useHistory } from 'react-router';
import { Header } from 'semantic-ui-react';

import { actions, selectors } from '../../../../redux/modules/playlist';

import Page from './Page';
import { withNamespaces } from 'react-i18next';
import { getActivePartFromQuery } from '../../../../helpers/player';

const PlaylistMyContainer = ({ id, t }) => {

  const location = useLocation();
  const history  = useHistory();

  const { pId, cuId, wip } = useSelector(state => selectors.getInfo(state.playlist));
  const cuIds              = useSelector(state => selectors.getPlaylist(state.playlist));

  const dispatch = useDispatch();

  useEffect(() => {
    if (id !== pId && !wip) {
      dispatch(actions.myPlaylistBuild(id));
    }
  }, [id, pId, wip]);

  useEffect(() => {
    if (cuId) {
      const up    = cuIds.findIndex(id => cuId === id);
      const newUp = getActivePartFromQuery(location);
      if (up !== newUp) {
        dispatch(actions.select(cuIds[newUp]));
      }
    }
  }, [cuIds, cuId, history, location]);

  if (cuIds.length === 0)
    return (<Header size="large" content={t('personal.playlistNoResult')} />);

  return (
    <Page />
  );
};

export default withNamespaces()(PlaylistMyContainer);
