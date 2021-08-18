import React from 'react';
import { withRouter } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Divider } from 'semantic-ui-react';

import ItemsByNamespace from './helper';
import { selectors } from '../../../redux/modules/auth';
import { MY_NAMESPACE_PLAYLIST_ITEMS, MY_NAMESPACES } from '../../../helpers/consts';

const Main = () => {
  const user = useSelector(state => selectors.getUser(state.auth));

  const isLogined  = () => (
    <>
      {
        MY_NAMESPACES
          .filter(n => n !== MY_NAMESPACE_PLAYLIST_ITEMS)
          .map((n, i) => (
              <div key={i}>
                <ItemsByNamespace namespace={n} withSeeAll={true} />
                {(i < MY_NAMESPACES.length - 1) ? <Divider hidden section /> : null}
              </div>
            )
          )
      }
    </>
  );
  const notLogined = () => <h1>You must log in to view the page</h1>;

  return user ? isLogined() : notLogined();
};

export default withRouter(Main);
