import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
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

const PlaylistCollectionPage = ({
  collection = null,
  wip = false,
  err = null,
  PlaylistComponent = Playlist,
  nextLink = null,
  prevLink = null,
  location = {},
  uiLanguage,
  contentLanguage,
  t,
}) => {
  const [embed, setEmbed] = useState(false);
  const [unit, setUnit]   = useState(null);

  useEffect(() => setEmbed(playerHelper.getEmbedFromQuery(location)), [location]);

  const handleSelectedChange = selected => setUnit(selected);

  const wipErr = WipErr({ wip, err, t });
  if (wipErr) {
    return wipErr;
  }

  if (!collection || !Array.isArray(collection.content_units)) {
    return null;
  }

  return !embed ? (
    <div className="playlist-collection-page">
      <div className="avbox">
        <Container>
          <Grid padded>
            <PlaylistAVBox
              collection={collection}
              uiLanguage={uiLanguage}
              contentLanguage={contentLanguage}
              onSelectedChange={handleSelectedChange}
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
      onSelectedChange={handleSelectedChange}
      PlayListComponent={PlaylistComponent}
      nextLink={nextLink}
      prevLink={prevLink}
    />
  );
};

PlaylistCollectionPage.propTypes = {
  collection: shapes.GenericCollection,
  wip: shapes.WIP,
  err: shapes.Error,
  PlaylistComponent: PropTypes.func,
  uiLanguage: PropTypes.string.isRequired,
  contentLanguage: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired,
  location: shapes.HistoryLocation,
  nextLink: PropTypes.string,
  prevLink: PropTypes.string,
};

export default withNamespaces()(PlaylistCollectionPage);
