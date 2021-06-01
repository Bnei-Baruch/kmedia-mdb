import { Divider } from 'semantic-ui-react';
import History from './History'
import Playlists from './Playlists'


const Main = () => (
  <div>
    <History />
    <Divider hidden section />
    <Playlists />
  </div>
)

export default Main;
