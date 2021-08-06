import { Divider } from 'semantic-ui-react';
import HistoryAndLikes from './HistoryAndLikes';
import Playlists from './Playlist/Playlists';
import Subscriptions from './Subscriptions/Subscriptions';
import { useSelector } from 'react-redux';
import { selectors } from '../../../redux/modules/auth';
import { MY_NAMESPACE_HISTORY, MY_NAMESPACE_LIKES } from '../../../helpers/consts';

const Main = () => {
  const user = useSelector(state => selectors.getUser(state.auth));

  const isLogined  = () => (
    <div>
      <HistoryAndLikes namespace={MY_NAMESPACE_HISTORY} />
      <Divider hidden section />
      <Playlists />
      <Divider hidden section />
      <HistoryAndLikes namespace={MY_NAMESPACE_LIKES} />
      <Divider hidden section />
      <Subscriptions />
    </div>
  );
  const notLogined = () => <h1>You must log in to view the page</h1>;

  return user ? isLogined() : notLogined();
};

export default Main;
