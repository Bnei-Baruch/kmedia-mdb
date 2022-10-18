import React from 'react';
import { Grid, Container, Divider } from 'semantic-ui-react';

import Helmets from '../../../shared/Helmets';
import PlaylistHeader from './PlaylistHeader';
import Info from '../widgets/Info/Info';
import Materials from '../widgets/UnitMaterials/Materials';
import PlaylistItems from './PlaylistItems';
import Recommended from '../widgets/Recommended/Main/Recommended';
import PlayerContainer from '../../../Player/PlayerContainer';
import { useSelector } from 'react-redux';
import { selectors as playlist } from '../../../../redux/modules/playlist';

const Page = () => {

  const isReady = useSelector(state => playlist.getInfo(state.playlist).isReady);
  return (
    <Grid className="avbox">
      <Grid.Column width={10}>
        <div id="avbox_playlist">
          {isReady && <PlaylistHeader />}
        </div>
        <PlayerContainer />
        <Container id="unit_container">
          {
            isReady && (
              <>
                <Helmets.AVUnit />
                <Info />
                <Materials />
              </>
            )
          }
        </Container>
      </Grid.Column>
      <Grid.Column width={6}>
        <PlaylistItems />
        <Divider hidden />
        {isReady && <Recommended filterOutUnits={[]} />}
      </Grid.Column>
    </Grid>
  );

};

export default Page;
