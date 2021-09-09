import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import { Header } from 'semantic-ui-react';

import { MY_NAMESPACE_LIKES } from '../../../helpers/consts';
import { actions, selectors } from '../../../redux/modules/my';
import { selectors as mdbSelectors } from '../../../redux/modules/mdb';
import { selectors as settings } from '../../../redux/modules/settings';
import { selectors as auth } from '../../../redux/modules/auth';
import WipErr from '../../shared/WipErr/WipErr';
import Page from './Page';

const PlaylistLikeContainer = ({ t }) => {
  const items      = useSelector(state => selectors.getItems(state.my, MY_NAMESPACE_LIKES)) || [];
  const wip        = useSelector(state => selectors.getWIP(state.my, MY_NAMESPACE_LIKES));
  const err        = useSelector(state => selectors.getErr(state.my, MY_NAMESPACE_LIKES));
  const uiLanguage = useSelector(state => settings.getLanguage(state.settings));
  const user       = useSelector(state => auth.getUser(state.auth));

  const content_units     = useSelector(state => items.map(x => mdbSelectors.getDenormContentUnit(state.mdb, x.content_unit_uid))) || [];
  const cuUIDs            = items.map(x => x.content_unit_uid);
  const fictiveCollection = {
    content_units,
    id: MY_NAMESPACE_LIKES,
    cuIDs: cuUIDs,
    name: t('personal.likes'),
    content_type: MY_NAMESPACE_LIKES
  };

  const dispatch = useDispatch();
  useEffect(() => {
    user && dispatch(actions.fetch(MY_NAMESPACE_LIKES, { page_no: 1, page_size: 100, with_files: true }));
  }, [uiLanguage, user]);

  const wipErr = WipErr({ wip, err, t });
  if (wipErr) return wipErr;
  if (content_units.length === 0)
    return (<Header size="large" content={t('personal.playlistNoResult', { name: t('personal.likes') })} />);

  return (
    <Page collection={fictiveCollection} />
  );
};

export default withNamespaces()(PlaylistLikeContainer);
