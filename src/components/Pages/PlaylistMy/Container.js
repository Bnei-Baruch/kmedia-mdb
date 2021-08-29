import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withNamespaces } from 'react-i18next';

import { MY_NAMESPACE_LIKES, MY_NAMESPACE_PLAYLIST_BY_ID } from '../../../helpers/consts';
import { actions, selectors } from '../../../redux/modules/my';
import { selectors as mdbSelectors } from '../../../redux/modules/mdb';
import WipErr from '../../shared/WipErr/WipErr';
import Page from '../PlaylistCollection/Page';
import { Header } from 'semantic-ui-react';
import playerHelper from '../../../helpers/player';
import { selectors as settings } from '../../../redux/modules/settings';

const PlaylistMyContainer = ({ t, history, location, id }) => {
  const playlist      = useSelector(state => selectors.getPlaylistById(state.my, id)) || {};
  const wip           = useSelector(state => selectors.getWIP(state.my, MY_NAMESPACE_PLAYLIST_BY_ID));
  const err           = useSelector(state => selectors.getErr(state.my, MY_NAMESPACE_PLAYLIST_BY_ID));
  const uiLanguage    = useSelector(state => settings.getLanguage(state.settings));
  const content_units = useSelector(state => playlist.playlist_items?.map(x => mdbSelectors.getDenormContentUnit(state.mdb, x.content_unit_uid)).filter(x => !!x)) || [];

  const cuUIDs            = content_units.map(c => c.id);
  const cuUID             = playlist.last_played || cuUIDs[0];
  const fictiveCollection = { content_units, id: 'f', cuIDs: cuUIDs, name: playlist.name };

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(actions.fetchById(MY_NAMESPACE_PLAYLIST_BY_ID, { id }));
  }, [id, uiLanguage]);

  useEffect(() => {
    if (cuUID && !playerHelper.getActivePartFromQuery(location)) {
      const selected = content_units.findIndex(u => u.id === cuUID);
      playerHelper.setActivePartInQuery(history, selected);
    }
  }, [cuUID]);

  const wipErr = WipErr({ wip, err, t });
  if (wipErr) return wipErr;
  if (content_units.length === 0)
    return (<Header size="large" content={t('personal.playlistNoResult', { name: playlist.name })} />);

  return (
    <Page collection={fictiveCollection} />
  );
};

export default withNamespaces()(PlaylistMyContainer);
