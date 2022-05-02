import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { Container, Grid } from 'semantic-ui-react';
import isEqual from 'react-fast-compare';

import { selectors as settings } from '../../../redux/modules/settings';
import { ClientChroniclesContext, DeviceInfoContext } from '../../../helpers/app-contexts';
import { usePrevious } from '../../../helpers/utils';
import playerHelper from '../../../helpers/player';
import Helmets from '../../shared/Helmets';
import * as shapes from '../../shapes';
import Info from '../Unit/widgets/Info/Info';
import Materials from '../Unit/widgets/UnitMaterials/Materials';
import Recommended from '../Unit/widgets/Recommended/Main/Recommended';
import Playlist from './widgets/Playlist/Playlist';
import PlaylistHeader from './widgets/Playlist/PlaylistHeader';
import AVPlaylistPlayer from '../../AVPlayer/AVPlaylistPlayer';

const PlaylistCollectionPage = ({ collection, nextLink = null, prevLink = null, cuId }) => {
  const location           = useLocation();
  const history            = useHistory();
  const { isMobileDevice } = useContext(DeviceInfoContext);
  const chronicles         = useContext(ClientChroniclesContext);

  const uiLanguage      = useSelector(state => settings.getLanguage(state.settings));
  const contentLanguage = useSelector(state => settings.getContentLanguage(state.settings));

  const embed                   = playerHelper.getEmbedFromQuery(location);
  const [unit, setUnit]         = useState(null);
  const [selected, setSelected] = useState(0);
  const [playlist, setPlaylist] = useState(null);

  const prev = usePrevious({ unit, collection });

  useEffect(() => {
    if (prev?.unit?.id !== unit?.id) {
      if (prev?.unit?.id) {
        chronicles.append('collection-unit-unselected', { unit_uid: prev.unit.id });
      }

      if (unit?.id) {
        chronicles.append('collection-unit-selected', { unit_uid: unit.id });
      }
    }

    if (prev?.unit?.id && !unit?.id) {
      chronicles.append('collection-unit-unselected', { unit_uid: unit.id });
    }
  }, [unit, prev?.unit, chronicles]);

  const handleLanguageChange = useCallback((e, language) => {
    playerHelper.setLanguageInQuery(history, language);
  }, [history]);

  const handleSwitchAV = useCallback(() => {
    const selectedItem = playlist?.items[selected];

    if (selectedItem) {
      playerHelper.switchAV(selectedItem, history);
    }
  }, [history, playlist, selected]);

  const handleSelectedChange = useCallback(nSelected => {
    if (nSelected !== selected && playlist?.items && playlist?.items[nSelected]) {
      history.push(`/${uiLanguage}${playlist.items[nSelected].shareUrl}`);
    }
  }, [history, playlist, selected, uiLanguage]);

  // we need to calculate the playlist here, so we can filter items out of recommended
  // playlist { collection, language, mediaType, items, groups };
  useEffect(() => {
    const preferredMT    = playerHelper.restorePreferredMediaType();
    const mediaType      = playerHelper.getMediaTypeFromQuery(location, preferredMT);
    const playerLanguage = playlist?.language || contentLanguage;
    const uiLang         = playlist?.language || uiLanguage;
    const contentLang    = playerHelper.getLanguageFromQuery(location, playerLanguage);

    const nPlaylist = playerHelper.playlist(collection, mediaType, contentLang, uiLang);
    if (
      nPlaylist?.collection.id !== playlist?.collection.id ||
      nPlaylist?.mediaType !== playlist?.mediaType ||
      nPlaylist?.language !== playlist?.language
    ) {
      setPlaylist(nPlaylist);
    }
  }, [collection, contentLanguage, location, playlist, uiLanguage]);

  useEffect(() => {
    const newSel = cuId ? playlist?.items.findIndex(i => i.unit.id === cuId) : playerHelper.getActivePartFromQuery(location);
    if (!isNaN(newSel) && newSel !== -1) {
      setSelected(newSel);
      const newUnit = playlist?.items[newSel]?.unit;
      setUnit(newUnit);
    }
  }, [playlist, cuId]);

  if (!collection || !Array.isArray(collection.content_units)) {
    return null;
  }

  if (!playlist || !unit) {
    return null;
  }

  const { items }      = playlist;
  const filterOutUnits = items.map(item => item.unit).filter(u => !!u) || [];

  // Don't recommend lesson preparation, skip to next unit.
  let recommendUnit = unit;
  const ccuNames    = collection?.ccuNames || {};
  const isUnitPrep  = ccuNames?.[unit?.id] === '0' && Object.values(ccuNames).filter(value => value === '0').length === 1;
  if (isUnitPrep && Array.isArray(playlist?.items)) {
    const indexOfUnit = playlist.items.findIndex(item => item?.unit?.id === unit.id);
    if (indexOfUnit !== -1 && indexOfUnit + 1 < playlist.items.length) {
      recommendUnit = playlist.items[indexOfUnit + 1].unit;
    }
  }

  const PlaylistData = () =>
    <>
      <Playlist
        playlist={playlist}
        selected={selected}
      />
      <br />
      <Recommended unit={recommendUnit} filterOutUnits={filterOutUnits} />
    </>;

  const computerWidth = isMobileDevice ? 16 : 10;

  return !embed ?
    (
      <Grid padded={!isMobileDevice} className="avbox">
        <Grid.Column mobile={16} tablet={computerWidth} computer={computerWidth} className={clsx({ 'is-fitted': isMobileDevice })}>
          {
            unit &&
            <div id="avbox_playlist">
              <PlaylistHeader collection={collection} prevLink={prevLink} nextLink={nextLink} unit={unit} />
            </div>
          }
          <AVPlaylistPlayer
            items={items}
            selected={selected}
            onSelectedChange={handleSelectedChange}
            onLanguageChange={handleLanguageChange}
            onSwitchAV={handleSwitchAV}
          />
          {
            unit &&
            <Container id="unit_container">
              <Helmets.AVUnit unit={unit} language={uiLanguage} />
              <Info unit={unit} currentCollection={collection} />
            </Container>
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

PlaylistCollectionPage.propTypes = {
  collection: shapes.GenericCollection,
  nextLink: PropTypes.string,
  prevLink: PropTypes.string,
};

const isEqualLink = (link1, link2) =>
  (!link1 && !link2) || link1 === link2;

const areEqual = (prevProps, nextProps) => (
  isEqual(prevProps.collection, nextProps.collection)
  && (prevProps.cuId === nextProps.cuId)
  && isEqualLink(prevProps.prevLink, nextProps.prevLink)
  && isEqualLink(prevProps.nextLink, nextProps.nextLink)
);

export default React.memo(PlaylistCollectionPage, areEqual);
