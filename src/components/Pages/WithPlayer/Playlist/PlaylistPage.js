import React from 'react';
import { Grid, Container, Divider } from 'semantic-ui-react';
import { useSelector } from 'react-redux';

import AVPlayer from '../../../AVPlayer/AVPlayer';
import Helmets from '../../../shared/Helmets';
import PlaylistHeader from './PlaylistHeader';
import Info from '../widgets/Info/Info';
import Materials from '../widgets/UnitMaterials/Materials';
import Playlist from './Playlist';
import { selectors as settings } from '../../../../redux/modules/settings';
import Recommended from '../widgets/Recommended/Main/Recommended';
import { selectors as mdb } from '../../../../redux/modules/mdb';
import { selectors as player } from '../../../../redux/modules/player';

const PlaylistPage = ({ cId, cuId }) => {
  const language = useSelector(state => settings.getLanguage(state.settings));
  const unit     = useSelector(state => mdb.getDenormContentUnit(state.mdb, cuId));
  const overMode = useSelector(state => player.getOverMode(state.player));
  const start    = 50;
  const end      = 60;
  return (
    <Grid className="avbox">
      <Grid.Column width={10}>
        <div id="avbox_playlist">
          <PlaylistHeader cId={cId} cuId={cuId} />
        </div>
        <AVPlayer />
        {/*{overMode === PLAYER_OVER_MODES.share && <ShareFormDesktop start={start} end={end} onExit={() => null} />}*/}
        <Container id="unit_container">
          <Helmets.AVUnit cuId={cuId} language={language} />
          <Info cId={cId} cuId={cuId} />
          <Materials unit={unit} />
        </Container>
      </Grid.Column>
      <Grid.Column width={6}>
        <Playlist />
        <Divider hidden />
        <Recommended unit={unit} filterOutUnits={[]} />
      </Grid.Column>
    </Grid>
  );

};

export default PlaylistPage;
