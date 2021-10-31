import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import { Header } from 'semantic-ui-react';

import { actions, selectors } from '../../../redux/modules/my';
import { selectors as mdbSelectors } from '../../../redux/modules/mdb';
import { selectors as settings } from '../../../redux/modules/settings';
import { selectors as auth } from '../../../redux/modules/auth';
import {
  MY_NAMESPACE_PLAYLIST_BY_ID,
  MY_NAMESPACE_PLAYLIST_ITEMS,
  MY_NAMESPACE_PLAYLISTS
} from '../../../helpers/consts';
import playerHelper from '../../../helpers/player';
import WipErr from '../../shared/WipErr/WipErr';
import Page from './Page';
import { actions as recommended } from '../../../redux/modules/recommended';

const PlaylistMyContainer = ({ t, history, location, id }) => {
  const playlist      = useSelector(state => selectors.getItemByKey(state.my, MY_NAMESPACE_PLAYLISTS, id)) || {};
  const wip           = useSelector(state => selectors.getWIP(state.my, MY_NAMESPACE_PLAYLISTS));
  const err           = useSelector(state => selectors.getErr(state.my, MY_NAMESPACE_PLAYLISTS));
  const uiLanguage    = useSelector(state => settings.getLanguage(state.settings));
  const content_units = useSelector(state => playlist.items?.map(x => mdbSelectors.getDenormContentUnit(state.mdb, x.content_unit_uid)).filter(x => !!x)) || [];
  const user          = useSelector(state => auth.getUser(state.auth));

  const cuUIDs            = content_units.map(c => c.id);
  const cuUID             = playlist.last_played || cuUIDs[0];
  const fictiveCollection = { content_units, id, cuIDs: cuUIDs, name: playlist.name };

  const dispatch = useDispatch();
  useEffect(() => {
    user && dispatch(actions.fetchOne(MY_NAMESPACE_PLAYLISTS, { id }));
  }, [id, uiLanguage, user, dispatch]);

  useEffect(() => {
    (cuUIDs.length > 0) && dispatch(recommended.fetchViews(cuUIDs));
  }, [cuUIDs.length, dispatch]);

  useEffect(() => {
    if (user && cuUID && !playerHelper.getActivePartFromQuery(location)) {
      const selected = content_units.findIndex(u => u.id === cuUID);
      playerHelper.setActivePartInQuery(history, selected);
    }
  }, [cuUID, content_units, history, location, user]);

  const wipErr = WipErr({ wip, err, t });
  if (wipErr) return wipErr;
  if (content_units.length === 0)
    return (<Header size="large" content={t('personal.playlistNoResult')} />);

  return (
    <Page collection={fictiveCollection} />
  );
};

export default withNamespaces()(PlaylistMyContainer);
