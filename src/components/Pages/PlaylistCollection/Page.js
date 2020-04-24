import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { Container, Grid } from 'semantic-ui-react';

import * as shapes from '../../shapes';
import WipErr from '../../shared/WipErr/WipErr';
import Helmets from '../../shared/Helmets';
import Materials from '../Unit/widgets/UnitMaterials/Materials';
import Info from '../Unit/widgets/Info/Info';
import MediaDownloads from '../Unit/widgets/Downloads/MediaDownloads';
import PlaylistAVBox from './widgets/PlaylistAVBox/PlaylistAVBox';
import Playlist from './widgets/Playlist/Playlist';
import playerHelper from '../../../helpers/player';

class PlaylistCollectionPageOriginal extends Component {
  static propTypes = {
    collection: shapes.GenericCollection,
    wip: shapes.WIP,
    err: shapes.Error,
    PlaylistComponent: PropTypes.func,
    uiLanguage: PropTypes.string.isRequired,
    contentLanguage: PropTypes.string.isRequired,
    t: PropTypes.func.isRequired,
    location: shapes.HistoryLocation,
    // shouldRenderHelmet: PropTypes.bool,
    nextLink: PropTypes.string,
    prevLink: PropTypes.string,
  };

  static defaultProps = {
    collection: null,
    wip: false,
    err: null,
    PlaylistComponent: Playlist,
    // shouldRenderHelmet: true,
    nextLink: null,
    prevLink: null,
    location: {},
  };

  constructor(props) {
    super(props);
    const { location } = this.props;
    this.state         = {
      selected: null,
      embed: playerHelper.getEmbedFromQuery(location)
    };
  }

  handleSelectedChange = selected => this.setState({ selected });

  render() {
    const { uiLanguage, contentLanguage, collection, wip, err, t, PlaylistComponent, nextLink, prevLink } = this.props;

    const wipErr = WipErr({ wip, err, t });
    if (wipErr) {
      return wipErr;
    }

    if (!collection || !Array.isArray(collection.content_units)) {
      return null;
    }

    const { selected: unit, embed } = this.state;

    return !embed ? (
      <div className="playlist-collection-page">
        {/* {this.renderCollectionHelmet()} */}
        <div className="avbox">
          <Container>
            <Grid padded>
              <PlaylistAVBox
                collection={collection}
                uiLanguage={uiLanguage}
                contentLanguage={contentLanguage}
                onSelectedChange={this.handleSelectedChange}
                PlayListComponent={PlaylistComponent}
                nextLink={nextLink}
                prevLink={prevLink}
              />
            </Grid>
          </Container>
        </div>
        {
          unit
            ? (
              <Container>
                <Helmets.AVUnit unit={unit} language={uiLanguage} />
                <Grid padded>
                  <Grid.Row>
                    <Grid.Column mobile={16} tablet={16} computer={11} className="content__main">
                      <Info unit={unit} />
                      <Materials unit={unit} />
                    </Grid.Column>
                    <Grid.Column mobile={16} tablet={16} computer={5} className="content__aside">
                      <Grid>
                        <Grid.Row>
                          <Grid.Column mobile={16} tablet={8} computer={16}>
                            <MediaDownloads unit={unit} />
                          </Grid.Column>
                        </Grid.Row>
                      </Grid>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Container>
            )
            : null
        }
      </div>
    ) : (
      <PlaylistAVBox
        collection={collection}
        uiLanguage={uiLanguage}
        contentLanguage={contentLanguage}
        t={t}
        onSelectedChange={this.handleSelectedChange}
        PlayListComponent={PlaylistComponent}
        nextLink={nextLink}
        prevLink={prevLink}
      />
    );
  }
}

const Extended = withTranslation()(PlaylistCollectionPageOriginal);

class PlaylistCollectionPage extends Component {
  render() {
    return <Extended useSuspense={false} {...this.props} />;
  }
}

export default PlaylistCollectionPage;
