import React, { useEffect, useState, useContext, useCallback } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import { Container, Grid } from 'semantic-ui-react';
import isEqual from 'react-fast-compare';

import * as shapes from '../../shapes';
import Helmets from '../../shared/Helmets';
import Materials from '../Unit/widgets/UnitMaterials/Materials';
import Info from '../Unit/widgets/Info/Info';
import Recommended from '../Unit/widgets/Recommended/Main/Recommended';
import Playlist from './widgets/Playlist/Playlist';
import PlaylistHeader from './widgets/Playlist/PlaylistHeader';
import playerHelper from '../../../helpers/player';
import { DeviceInfoContext } from "../../../helpers/app-contexts";
import { MT_AUDIO, MT_VIDEO } from '../../../helpers/consts';
import { selectors as settings } from '../../../redux/modules/settings';
import AVPlaylistPlayer from '../../AVPlayer/AVPlaylistPlayer';


const PlaylistCollectionPage = ({ collection, nextLink = null, prevLink = null }) => {
  const location = useLocation();
  const history  = useHistory();
  const { isMobileDevice } = useContext(DeviceInfoContext);

  const uiLanguage = useSelector(state => settings.getLanguage(state.settings));
  const contentLanguage = useSelector(state => settings.getContentLanguage(state.settings));

  const embed = playerHelper.getEmbedFromQuery(location);
  const [unit, setUnit]   = useState(null);
  const [selected, setSelected] = useState(0);
  const [playlist, setPlaylist] = useState(null);

  const handleSelectedChange = useCallback(nSelected => {
    if (nSelected !== selected){
      playerHelper.setActivePartInQuery(history, nSelected);
      setSelected(nSelected);
    }
  }, [history, selected]);

  const handleLanguageChange = useCallback((e, language) => {
    playerHelper.setLanguageInQuery(history, language);
  }, [history]);

  const handleSwitchAV = useCallback(() => {
    const selectedItem = playlist?.items[selected];

    if (selectedItem){
      playerHelper.switchAV(selectedItem, history);
    }
  }, [history, playlist, selected]);

  // we need to calculate the playlist here, so we can filter items out of recommended
  // playlist { collection, language, mediaType, items, groups };
  useEffect(() => {
    const preferredMT     = playerHelper.restorePreferredMediaType();
    const mediaType       = playerHelper.getMediaTypeFromQuery(location, preferredMT);
    const playerLanguage  = playlist?.language || contentLanguage;
    const uiLang          = playlist?.language || uiLanguage;
    const contentLang     = playerHelper.getLanguageFromQuery(location, playerLanguage);

    const nPlaylist  = playerHelper.playlist(collection, mediaType, contentLang, uiLang);
    setPlaylist(nPlaylist);
  }, [collection, contentLanguage, location, playlist?.language, uiLanguage]);


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


  if (!collection || !Array.isArray(collection.content_units)) {
    return null;
  }

  if (!playlist || !unit){
    return null;
  }

  const { items, language } = playlist;

  const filterOutUnits = items.map(item => item.unit).filter(u => !!u) || [];

  const PlaylistData = () =>
    <>
      <Playlist
        playlist={playlist}
        selected={selected}
        onSelectedChange={handleSelectedChange}
        nextLink={nextLink}
        prevLink={prevLink}
      />
      <Recommended unit={unit} filterOutUnits={filterOutUnits} />
    </>;

  const computerWidth = isMobileDevice ? 16 : 10;

  return !embed ? (
    <Grid padded={!isMobileDevice} className="avbox">
      <Grid.Column mobile={16} tablet={computerWidth} computer={computerWidth}
        className={classNames({"is-fitted": isMobileDevice})}>
        <AVPlaylistPlayer
          items={items}
          selected={selected}
          language={language}
          onSelectedChange={handleSelectedChange}
          onLanguageChange={handleLanguageChange}
          onSwitchAV={handleSwitchAV}
        />
        {
          unit &&
            <>
              { isMobileDevice &&
                <div id="avbox_playlist">
                  <PlaylistHeader collection={collection} prevLink={prevLink} nextLink={nextLink} />
                </div>
              }
              <Container id="unit_container">
                <Helmets.AVUnit unit={unit} language={uiLanguage} />
                <Info unit={unit} />
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
        language={language}
        onSelectedChange={handleSelectedChange}
        onLanguageChange={handleLanguageChange}
        onSwitchAV={handleSwitchAV}
      />
    </Container>
};

PlaylistCollectionPage.propTypes = {
  collection: shapes.GenericCollection,
  nextLink: PropTypes.string,
  prevLink: PropTypes.string,
};

const isEqualLink = (link1, link2) =>
  (!link1 && !link2) || link1 === link2;

const areEqual = (prevProps, nextProps) =>
  isEqual(prevProps.collection, nextProps.collection)
  && isEqualLink(prevProps.prevLink, nextProps.prevLink)
  && isEqualLink(prevProps.nextLink, nextProps.nextLink);

export default React.memo(PlaylistCollectionPage, areEqual);
