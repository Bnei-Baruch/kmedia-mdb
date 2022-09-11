import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import { Header } from 'semantic-ui-react';

import { actions, selectors } from '../../../redux/modules/my';
import { selectors as mdbSelectors } from '../../../redux/modules/mdb';
import { selectors as settings } from '../../../redux/modules/settings';
import { selectors as auth } from '../../../redux/modules/auth';
import { MY_NAMESPACE_PLAYLISTS } from '../../../helpers/consts';
import playerHelper from '../../../helpers/player';
import Page from './Page';
import { actions as recommended } from '../../../redux/modules/recommended';
import { getMyItemKey } from '../../../helpers/my';

const PlaylistMyContainer = ({ t, history, location, id }) => {
  const { key }  = getMyItemKey(MY_NAMESPACE_PLAYLISTS, { id });
  const playlist = useSelector(state => selectors.getItemByKey(state.my, MY_NAMESPACE_PLAYLISTS, key)) || {};
  /*
  const wip           = useSelector(state => selectors.getWIP(state.my, MY_NAMESPACE_PLAYLISTS));
  const err           = useSelector(state => selectors.getErr(state.my, MY_NAMESPACE_PLAYLISTS));
  */
  const uiLanguage = useSelector(state => settings.getLanguage(state.settings));
  const denormCU   = useSelector(state => mdbSelectors.nestedGetDenormContentUnit(state.mdb));
  const user       = useSelector(state => auth.getUser(state.auth));

  const content_units     = useMemo(() => playlist.items?.map(x => denormCU(x.content_unit_uid)).filter(x => !!x) || [],
    [playlist.items]);
  const cuUIDs            = useMemo(() => content_units.map(c => c.id), [content_units]);
  const cuUID             = playlist.last_played || cuUIDs[0];
  const fictiveCollection = useMemo(() => ({ content_units, id, cuIDs: cuUIDs, name: playlist.name }), [id, content_units, cuUIDs, playlist.name]);

  const dispatch = useDispatch();
  useEffect(() => {
    user && dispatch(actions.fetchOne(MY_NAMESPACE_PLAYLISTS, { id }));
  }, [id, uiLanguage, user, dispatch]);

  useEffect(() => {
    (cuUIDs.length > 0) && dispatch(recommended.fetchViews(cuUIDs));
  }, [cuUIDs, dispatch]);

  useEffect(() => {
    if (user && cuUID && !playerHelper.getActivePartFromQuery(location)) {
      const selected = content_units.findIndex(u => u.id === cuUID);
      playerHelper.setActivePartInQuery(history, selected);
    }
  }, [cuUID, content_units, history, location, user]);

  if (content_units.length === 0)
    return (<Header size="large" content={t('personal.playlistNoResult')} />);

  return (
    <Page collection={fictiveCollection} />
  );
};

export default withNamespaces()(PlaylistMyContainer);
