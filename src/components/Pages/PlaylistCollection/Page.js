import React, { useEffect, useState, useContext, useCallback } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Container, Grid } from 'semantic-ui-react';
import classNames from 'classnames';
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


const PlaylistCollectionPage = ({
  collection,
  nextLink = null,
  prevLink = null,
}) => {
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
      if (selectedItem.mediaType === MT_AUDIO && selectedItem.availableMediaTypes.includes(MT_VIDEO)) {
        playerHelper.setMediaTypeInQuery(history, MT_VIDEO);
        playerHelper.persistPreferredMediaType(MT_VIDEO);
      } else if (selectedItem.mediaType === MT_VIDEO && selectedItem.availableMediaTypes.includes(MT_AUDIO)) {
        playerHelper.setMediaTypeInQuery(history, MT_AUDIO);
        playerHelper.persistPreferredMediaType(MT_AUDIO);
      }
    }
  }, [history, playlist, selected]);

  // we need to calculate the playlist here, so we can filter items out of recommended
  // playlist { collection, language, mediaType, items, groups };
  const preferredMT     = playerHelper.restorePreferredMediaType();
  const mediaType       = playerHelper.getMediaTypeFromQuery(location, preferredMT);
  const playerLanguage  = playlist?.language || contentLanguage;
  const uiLang          = playlist?.language || uiLanguage;
  const contentLang     = playerHelper.getLanguageFromQuery(location, playerLanguage);

  useEffect(() => {
    const nPlaylist  = playerHelper.playlist(collection, mediaType, contentLang, uiLang);
    setPlaylist(nPlaylist);
  }, [collection, contentLang, mediaType, uiLang]);


  useEffect(() => {
    let nSelected = playerHelper.getActivePartFromQuery(location);

    if (nSelected >= playlist?.items.length) {
      nSelected = 0;
    }

    handleSelectedChange(nSelected);
  }, [handleSelectedChange, location, playlist]);


  useEffect(() => {
    const newUnit = playlist?.items[selected]?.unit;
    if (unit !== newUnit){
      setUnit(newUnit);
    }
  }, [playlist, selected, unit]);


  if (!collection || !Array.isArray(collection.content_units)) {
    return null;
  }

  if (!playlist || !unit){
    return null;
  }

  const { items, language } = playlist;

  const filterOutUnits = items.map(item => item.unit).filter(u => !!u) || [];
  const isAudio = items[selected].mediaType === MT_AUDIO;

  const PlaylistData = () =>
    <div>
      <Playlist
        playlist={playlist}
        selected={selected}
        onSelectedChange={handleSelectedChange}
        nextLink={nextLink}
        prevLink={prevLink}
      />
      <div id="avbox_recommended">
        <Recommended unit={unit} filterOutUnits={filterOutUnits} />
      </div>
    </div>;

  const computerWidth = isMobileDevice ? 16 : 10;

  return !embed ? (
    <div className="playlist-collection-page">
      <Grid container className="avbox">
        <Grid.Row className={classNames('', { 'layout--is-audio': isAudio })}>
          <Grid.Column mobile={16} tablet={computerWidth} computer={computerWidth}>
            <AVPlaylistPlayer
              items={items}
              selected={selected}
              language={language}
              uiLanguage={uiLanguage}
              onSelectedChange={handleSelectedChange}
              onLanguageChange={handleLanguageChange}
              onSwitchAV={handleSwitchAV}
              history={history}
            />
            {
              unit &&
              <div>
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
              </div>
            }
          </Grid.Column>
          {
            !isMobileDevice &&
              <Grid.Column mobile={16} tablet={6} computer={6}>
                {PlaylistData()}
              </Grid.Column>
          }
        </Grid.Row>
      </Grid>
    </div>
  ) :
    <Grid.Row
      className={classNames('', {
        'layout--is-audio': isAudio,
      })}
    >
      <Grid.Column mobile={16} tablet={16} computer={16}>
        <AVPlaylistPlayer
          items={items}
          selected={selected}
          language={language}
          uiLanguage={uiLanguage}
          onSelectedChange={handleSelectedChange}
          onLanguageChange={handleLanguageChange}
          onSwitchAV={handleSwitchAV}
          history={history}
        />
      </Grid.Column>
    </Grid.Row>
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
