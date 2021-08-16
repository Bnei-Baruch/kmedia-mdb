import React from 'react';
import { withRouter } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Divider } from 'semantic-ui-react';

import ItemsByNamespace from './helper';
import { selectors } from '../../../redux/modules/auth';
import {
  MY_NAMESPACE_HISTORY,
  MY_NAMESPACE_LIKES,
  MY_NAMESPACE_PLAYLISTS,
  MY_NAMESPACE_SUBSCRIPTIONS
} from '../../../helpers/consts';

const Main = () => {
  const user = useSelector(state => selectors.getUser(state.auth));

  const isLogined  = () => (
    <div>
      <ItemsByNamespace namespace={MY_NAMESPACE_HISTORY} />
      <Divider hidden section />
      <ItemsByNamespace namespace={MY_NAMESPACE_PLAYLISTS} />
      <Divider hidden section />
      <ItemsByNamespace namespace={MY_NAMESPACE_LIKES} />
      <Divider hidden section />
      <ItemsByNamespace namespace={MY_NAMESPACE_SUBSCRIPTIONS} />
    </div>
  );
  const notLogined = () => <h1>You must log in to view the page</h1>;

  return user ? isLogined() : notLogined();
};

export default withRouter(Main);
