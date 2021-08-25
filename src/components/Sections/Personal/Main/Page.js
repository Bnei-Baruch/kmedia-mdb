import React from 'react';
import { withRouter } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Divider } from 'semantic-ui-react';

import ItemsByNamespace from './ItemsByNamespace';
import { selectors } from '../../../../redux/modules/auth';
import {
  MY_NAMESPACE_HISTORY,
  MY_NAMESPACE_LIKES,
  MY_NAMESPACE_PLAYLISTS,
  MY_NAMESPACE_SUBSCRIPTIONS,
} from '../../../../helpers/consts';

const Page = () => {
  const user = useSelector(state => selectors.getUser(state.auth));

  const isLogined  = () => (
    <>
      <ItemsByNamespace namespace={MY_NAMESPACE_HISTORY} withSeeAll={true} />
      <Divider hidden section />
      <ItemsByNamespace namespace={MY_NAMESPACE_LIKES} withSeeAll={true} />
      <Divider hidden section />
      <ItemsByNamespace namespace={MY_NAMESPACE_PLAYLISTS} withSeeAll={false} />
      <Divider hidden section />
      <ItemsByNamespace namespace={MY_NAMESPACE_SUBSCRIPTIONS} withSeeAll={false} />

    </>
  );
  const notLogined = () => (
    <>
      <Divider hidden section />
      <h1>You must log in to view the page</h1>
      <Divider hidden section />
    </>
  );

  return user ? isLogined() : notLogined();
};

export default withRouter(Page);
