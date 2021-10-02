import React from 'react';
import { withRouter } from 'react-router-dom';

import {
  MY_NAMESPACE_HISTORY,
  MY_NAMESPACE_LIKES,
  MY_NAMESPACE_PLAYLISTS,
  MY_NAMESPACE_SUBSCRIPTIONS,
} from '../../../../helpers/consts';
import NeedToLogin from '../NeedToLogin';
import ItemsContainer from './ItemsContainer';

const Page = ({ t }) => {
  const needToLogin = NeedToLogin({ t });
  if (needToLogin) return needToLogin;

  return (
    <>
      <ItemsContainer namespace={MY_NAMESPACE_HISTORY} withSeeAll={true} />
      <ItemsContainer namespace={MY_NAMESPACE_LIKES} withSeeAll={true} />
      <ItemsContainer namespace={MY_NAMESPACE_PLAYLISTS} withSeeAll={false} />
      <ItemsContainer namespace={MY_NAMESPACE_SUBSCRIPTIONS} withSeeAll={false} />

    </>
  );
};

export default withRouter(Page);
