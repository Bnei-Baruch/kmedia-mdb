import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { Container, Grid } from 'semantic-ui-react';

import * as shapes from '../../shapes';
import WipErr from '../../shared/WipErr/WipErr';
import Materials from '../Unit/widgets/UnitMaterials/Materials';
import Info from '../Unit/widgets/Info/Info';
import MediaDownloads from '../Unit/widgets/Downloads/MediaDownloads';
import PlaylistAVBox from './widgets/PlaylistAVBox/PlaylistAVBox';
import Playlist from './widgets/Playlist/Playlist';

class PlaylistCollectionPage extends Component {

  static propTypes = {
    collection: shapes.GenericCollection,
    wip: shapes.WIP,
    err: shapes.Error,
    PlaylistComponent: PropTypes.func,
    language: PropTypes.string.isRequired,
    t: PropTypes.func.isRequired,
  };

  static defaultProps = {
    collection: null,
    wip: false,
    err: null,
    PlaylistComponent: Playlist
  };

  state = {
    selected: null,
  };

  handleSelectedChange = selected =>
    this.setState({ selected });

  render() {
    const { language, collection, wip, err, t, PlaylistComponent } = this.props;

    const wipErr = WipErr({ wip, err, t });
    if (wipErr) {
      return wipErr;
    }

    if (!collection || !Array.isArray(collection.content_units)) {
      return null;
    }

    const { selected: unit } = this.state;
    return (
      <div className="playlist-collection-page">
        <div className="avbox">
          <Container>
            <Grid padded>
              <PlaylistAVBox
                collection={collection}
                language={language}
                t={t}
                onSelectedChange={this.handleSelectedChange}
                PlayListComponent={PlaylistComponent}
              />
            </Grid>
          </Container>
        </div>
        {
          unit ?
            <Container>
              <Grid padded reversed="tablet">
                <Grid.Row reversed="computer">
                  <Grid.Column computer={6} tablet={8} mobile={16} className="content__aside">
                    <MediaDownloads unit={unit} language={language} t={t} />
                  </Grid.Column>
                  <Grid.Column computer={10} tablet={8} mobile={16} className="content__main">
                    <Info unit={unit} t={t} />
                    <Materials unit={unit} t={t} />
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Container>
            :
            null
        }
      </div>
    );
  }
}

export default translate()(PlaylistCollectionPage);
