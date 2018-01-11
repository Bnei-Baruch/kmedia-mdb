import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { Container, Grid } from 'semantic-ui-react';

import { formatError } from '../../../helpers/utils';
import * as shapes from '../../shapes';
import { ErrorSplash, FrownSplash, LoadingSplash } from '../../shared/Splash';
import PlaylistAVBox from './widgets/PlaylistAVBox/PlaylistAVBox';
import Materials from '../../shared/UnitMaterials/Materials';
import MediaDownloads from '../../shared/MediaDownloads';
import Info from '../../pages/Unit/widgets/Info/Info';
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
    selected: 0,
  };

  handleActivePartChange = selected =>
    this.setState({ selected });

  render() {
    const { language, collection, wip, err, t, PlaylistComponent } = this.props;

    if (err) {
      if (err.response && err.response.status === 404) {
        return <FrownSplash
          text={t('messages.not-found')}
          subtext={t('messages.not-found-subtext')}
        />;
      }

      return <ErrorSplash
        text={t('messages.server-error')}
        subtext={formatError(err)}
      />;
    }

    if (wip) {
      return <LoadingSplash
        text={t('messages.loading')}
        subtext={t('messages.loading-subtext')}
      />;
    }

    if (!collection || !Array.isArray(collection.content_units)) {
      return null;
    }

    const { selected } = this.state;
    const unit         = collection.content_units[selected];
    return (
      <div>
        <div className="avbox">
          <Container>
            <Grid padded>
              <PlaylistAVBox
                collection={collection}
                activePart={selected}
                language={language}
                t={t}
                onActivePartChange={this.handleActivePartChange}
                PlayListComponent={PlaylistComponent}
              />
            </Grid>
          </Container>
        </div>
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
      </div>
    );
  }
}

export default translate()(PlaylistCollectionPage);
