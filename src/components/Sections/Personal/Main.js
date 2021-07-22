import { Divider } from 'semantic-ui-react';
import History from './History';
import Playlists from './Playlists';
import Liked from './Liked';
import Subscriptions from './Subscriptions';
import { useSelector } from 'react-redux';
import { selectors } from '../../../redux/modules/auth';

const Main = () => {
  const user = useSelector(state => selectors.getUser(state.auth));

  const isLogined  = () => (
    <div>
      <History />
      <Divider hidden section />
      <Playlists />
      <Divider hidden section />
      <Liked />
      <Divider hidden section />
      <Subscriptions />
    </div>
  );
  const notLogined = () => <h1>You must be Autorisate for enter to this page</h1>;

  return user ? isLogined() : notLogined();
};

export default Main;
