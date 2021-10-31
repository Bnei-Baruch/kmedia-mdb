import React from 'react';
import { withRouter } from 'react-router-dom';

import { actions, selectors } from '../../../../redux/modules/my';
import {
  MY_NAMESPACE_HISTORY,
  MY_NAMESPACE_REACTIONS,
  MY_NAMESPACE_PLAYLISTS,
  MY_NAMESPACE_SUBSCRIPTIONS,
} from '../../../../helpers/consts';
import NeedToLogin from '../NeedToLogin';
import ItemsContainer from './ItemsContainer';
import { useDispatch, useSelector } from 'react-redux';
import AlertModal from '../../../shared/AlertModal';
import { withNamespaces } from 'react-i18next';

const Page = ({ t }) => {
  const deletedPlaylist = useSelector(state => selectors.getDeleted(state.my, MY_NAMESPACE_PLAYLISTS));
  const dispatch        = useDispatch();

  const needToLogin = NeedToLogin({ t });
  if (needToLogin) return needToLogin;

  const onAlertCloseHandler = () => dispatch(actions.setDeleted(MY_NAMESPACE_PLAYLISTS, false));

  return (
    <>
      <AlertModal message={t('personal.removedSuccessfully')} open={deletedPlaylist} onClose={onAlertCloseHandler} />
      <ItemsContainer namespace={MY_NAMESPACE_HISTORY} withSeeAll={true} />
      <ItemsContainer namespace={MY_NAMESPACE_REACTIONS} withSeeAll={true} />
      <ItemsContainer namespace={MY_NAMESPACE_PLAYLISTS} withSeeAll={false} />
      <ItemsContainer namespace={MY_NAMESPACE_SUBSCRIPTIONS} withSeeAll={false} />

    </>
  );
};

export default withNamespaces()(withRouter(Page));
