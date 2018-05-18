import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { Container, Grid } from 'semantic-ui-react';

import * as shapes from '../../shapes';
import WipErr from '../../shared/WipErr/WipErr';
import Helmets from '../../shared/Helmets';
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
    shouldRenderHelmet: PropTypes.bool,
    nextLink: PropTypes.string,
    prevLink: PropTypes.string,
  };

  static defaultProps = {
    collection: null,
    wip: false,
    err: null,
    PlaylistComponent: Playlist,
    shouldRenderHelmet: true
  };

  state = {
    selected: null,
  };

  handleSelectedChange = selected =>
    this.setState({ selected });

  renderHelmet() {
    const { collection, t, shouldRenderHelmet } = this.props;

    if (!shouldRenderHelmet) {
      return null;
    }

    let title = collection.name;
    // if the collection doesn't have a name, use a default.
    if (title === undefined) {
      title = t(`constants.content-types.${collection.content_type}`);
    }

    if (collection.film_date) {
      const filmDate = t('values.date', { date: new Date(collection.film_date) });
      title          = `${title} - ${filmDate}`;
    }

    return <Helmets.Basic title={title} />;
  }

  render() {
    const { language, collection, wip, err, t, PlaylistComponent, nextLink, prevLink } = this.props;

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
        {this.renderHelmet()}
        <div className="avbox">
          <Container>
            <Grid padded>
              <PlaylistAVBox
                collection={collection}
                language={language}
                t={t}
                onSelectedChange={this.handleSelectedChange}
                PlayListComponent={PlaylistComponent}       
                nextLink={nextLink}
                prevLink={prevLink}       
              />
            </Grid>
          </Container>
        </div>
        {
          unit ?
            <Container>
              <Grid padded>
                <Grid.Row>
                  <Grid.Column mobile={16} tablet={16} computer={11} className="content__main">
                    <Info unit={unit} t={t} />
                    <Materials unit={unit} t={t} />
                  </Grid.Column>
                  <Grid.Column mobile={16} tablet={16} computer={5} className="content__aside">
                    <Grid>
                      <Grid.Row>
                        <Grid.Column mobile={16} tablet={8} computer={16}>
                          <MediaDownloads unit={unit} language={language} t={t} />
                        </Grid.Column>
                      </Grid.Row>
                    </Grid>
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
