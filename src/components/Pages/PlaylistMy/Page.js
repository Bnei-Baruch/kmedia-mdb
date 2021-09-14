import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import { useSelector } from 'react-redux';
import { Container, Grid } from 'semantic-ui-react';

import Helmets from '../../shared/Helmets';
import Materials from '../Unit/widgets/UnitMaterials/Materials';
import Playlist from '../PlaylistCollection/widgets/Playlist/Playlist';
import playerHelper from '../../../helpers/player';
import { selectors as settings } from '../../../redux/modules/settings';
import AVPlaylistPlayer from '../../AVPlayer/AVPlaylistPlayer';
import { DeviceInfoContext } from '../../../helpers/app-contexts';
import * as PropTypes from 'prop-types';

import Info from '../Unit/widgets/Info/Info';
import PlaylistHeader from '../PlaylistCollection/widgets/Playlist/PlaylistHeader';
import * as shapes from '../../shapes';

const PlaylistMyPage = ({ collection }) => {
  const location           = useLocation();
  const history            = useHistory();
  const { isMobileDevice } = useContext(DeviceInfoContext);

  const uiLanguage      = useSelector(state => settings.getLanguage(state.settings));
  const contentLanguage = useSelector(state => settings.getContentLanguage(state.settings));

  const embed                   = playerHelper.getEmbedFromQuery(location);
  const [unit, setUnit]         = useState(null);
  const [selected, setSelected] = useState();
  const [playlist, setPlaylist] = useState(null);

  const handleSelectedChange = useCallback(nSelected => {
    if (nSelected !== selected) {
      playerHelper.setActivePartInQuery(history, nSelected);
      setSelected(nSelected);
    }
  }, [history, selected]);

  const handleLanguageChange = useCallback((e, language) => {
    playerHelper.setLanguageInQuery(history, language);
  }, [history]);

  const handleSwitchAV = useCallback(() => {
    const selectedItem = playlist?.items[selected];

    if (selectedItem) {
      playerHelper.switchAV(selectedItem, history);
    }
  }, [history, playlist, selected]);

  useEffect(() => {
    const preferredMT = playerHelper.restorePreferredMediaType();
    const mediaType   = playerHelper.getMediaTypeFromQuery(location, preferredMT);
    const nPlaylist   = playerHelper.playlistFromUnits(collection, mediaType, contentLanguage, uiLanguage);
    setPlaylist(nPlaylist);
  }, []);

  useEffect(() => {
    const preferredMT = playerHelper.restorePreferredMediaType();
    const mediaType   = playerHelper.getMediaTypeFromQuery(location, preferredMT);
    if (mediaType !== playlist?.mediaType) {
      const nPlaylist = playerHelper.playlistFromUnits(collection, mediaType, contentLanguage, uiLanguage);
      setPlaylist(nPlaylist);
    }
  }, [location]);

  useEffect(() => {
    let nSelected = playerHelper.getActivePartFromQuery(location);
    if (nSelected >= playlist?.items.length || nSelected < 0) {
      nSelected = 0;
    }
    setSelected(nSelected);
  }, [location, playlist]);

  useEffect(() => {
    const newUnit = playlist?.items[selected]?.unit;
    setUnit(newUnit);
  }, [selected]);

  if (!collection ||
    !Array.isArray(collection.content_units) ||
    !playlist ||
    !unit) {
    return null;
  }

  const { items } = playlist;

  const PlaylistData = () =>
    <Playlist
      playlist={playlist}
      selected={selected}
      onSelectedChange={handleSelectedChange}
    />;

  const computerWidth = isMobileDevice ? 16 : 10;

  return !embed ?
    (
      <Grid padded={!isMobileDevice} className="avbox">
        <Grid.Column mobile={16} tablet={computerWidth} computer={computerWidth} className={clsx({ 'is-fitted': isMobileDevice })}>
          <AVPlaylistPlayer
            items={items}
            selected={selected}
            onSelectedChange={handleSelectedChange}
            onLanguageChange={handleLanguageChange}
            onSwitchAV={handleSwitchAV}
          />
          {
            unit &&
            <>
              {isMobileDevice &&
              <div id="avbox_playlist">
                <PlaylistHeader collection={collection} />
              </div>
              }
              <Container className="unit_container">
                <Helmets.AVUnit unit={unit} language={uiLanguage} />
                <Info unit={unit} currentCollection={collection} />
                <Materials unit={unit} playlistComponent={PlaylistData} />
              </Container>
            </>
          }
        </Grid.Column>
        {
          !isMobileDevice &&
          <Grid.Column mobile={16} tablet={6} computer={6}>
            {PlaylistData()}
          </Grid.Column>
        }
      </Grid>
    ) :
    <Container mobile={16} tablet={16} computer={16} className="avbox">
      <AVPlaylistPlayer
        items={items}
        selected={selected}
        onSelectedChange={handleSelectedChange}
        onLanguageChange={handleLanguageChange}
        onSwitchAV={handleSwitchAV}
      />
    </Container>;
};

PlaylistMyPage.propTypes = {
  collection: shapes.GenericCollection,
};

export default PlaylistMyPage;
