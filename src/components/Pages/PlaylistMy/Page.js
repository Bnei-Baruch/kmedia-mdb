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
import { selectors as mdbSelectors } from '../../../redux/modules/mdb';

const PlaylistMyPage = ({ pId, playlistItems }) => {
  const location           = useLocation();
  const history            = useHistory();
  const { isMobileDevice } = useContext(DeviceInfoContext);

  const uiLanguage      = useSelector(state => settings.getLanguage(state.settings));
  const contentLanguage = useSelector(state => settings.getContentLanguage(state.settings));

  const embed                   = playerHelper.getEmbedFromQuery(location);
  const [unit, setUnit]         = useState(null);
  const [selected, setSelected] = useState();
  const [playlist, setPlaylist] = useState(null);

  const units = useSelector(state => playlistItems.map(x => mdbSelectors.getDenormContentUnit(state.mdb, x.content_unit_uid)));

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

  // we need to calculate the playlist here, so we can filter items out of recommended
  // playlist {  language, mediaType, items, groups };
  useEffect(() => {
    const preferredMT    = playerHelper.restorePreferredMediaType();
    const mediaType      = playerHelper.getMediaTypeFromQuery(location, preferredMT);
    const playerLanguage = playlist?.language || contentLanguage;
    const uiLang         = playlist?.language || uiLanguage;
    const contentLang    = playerHelper.getLanguageFromQuery(location, playerLanguage);

    const nPlaylist = playerHelper.playlistFromUnits(units, mediaType, contentLang, uiLang);
    setPlaylist(nPlaylist);
  }, [contentLanguage, location, playlist?.language, uiLanguage, pId]);

  useEffect(() => {
    let nSelected = playerHelper.getActivePartFromQuery(location);

    if (nSelected >= playlist?.items.length) {
      nSelected = 0;
    }

    handleSelectedChange(nSelected);
  }, [handleSelectedChange, location, playlist]);

  useEffect(() => {
    const newUnit = playlist?.items[selected]?.unit;
    setUnit(newUnit);
  }, [playlist, selected]);

  if (!playlist || !unit) {
    return null;
  }

  const { items } = playlist;

  const filterOutUnits = items.map(item => item.unit).filter(u => !!u) || [];

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
              <Container id="unit_container">
                <Helmets.AVUnit unit={unit} language={uiLanguage} />
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
  nextLink: PropTypes.string,
  prevLink: PropTypes.string,
};

const isEqualLink = (link1, link2) =>
  (!link1 && !link2) || link1 === link2;

const areEqual = (prevProps, nextProps) =>
  (prevProps.pId === nextProps.pId)
  && isEqualLink(prevProps.prevLink, nextProps.prevLink)
  && isEqualLink(prevProps.nextLink, nextProps.nextLink);

export default React.memo(PlaylistMyPage, areEqual);
