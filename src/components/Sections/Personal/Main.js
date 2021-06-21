import { Divider } from 'semantic-ui-react';
import History from './History'
import Playlists from './Playlists'
import Liked from './Liked';
import Subscriptions from './Subscriptions';

const Main = () => (
  <div>
    <History />
    <Divider hidden section />
    <Playlists />
    <Divider hidden section />
    <Liked />
    <Divider hidden section />
    <Subscriptions />
  </div>
)

export default Main;
