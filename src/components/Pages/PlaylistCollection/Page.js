import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { withNamespaces } from 'react-i18next';
import { Container, Grid, Button, Header } from 'semantic-ui-react';
import isEqual from 'react-fast-compare';

import * as shapes from '../../shapes';
import { selectors as settings } from '../../../redux/modules/settings';
import { ClientChroniclesContext, DeviceInfoContext } from '../../../helpers/app-contexts';
import { usePrevious, randomizeArray } from '../../../helpers/utils';
import playerHelper from '../../../helpers/player';
import { CT_SONGS } from '../../../helpers/consts';
import Helmets from '../../shared/Helmets';
import Info from '../Unit/widgets/Info/Info';
import Recommended from '../Unit/widgets/Recommended/Main/Recommended';
import Playlist from './widgets/Playlist/Playlist';
import PlaylistHeader from './widgets/Playlist/PlaylistHeader';
import AVPlaylistPlayer from '../../AVPlayer/AVPlaylistPlayer';
import Materials from '../Unit/widgets/UnitMaterials/Materials';

// Don't recommend lesson preparation, skip to next unit.
const getRecommendUnit = (unit, collection, items) => {
  let recommendUnit = unit;
  const { ccuNames } = collection;
  const isUnitPrep = ccuNames?.[unit.id] === '0' && Object.values(ccuNames).filter(value => value === '0').length === 1;
  if (isUnitPrep && Array.isArray(items)) {
    const indexOfUnit = items.findIndex(item => item?.unit?.id === unit.id);
    if (indexOfUnit !== -1 && indexOfUnit + 1 < items.length) {
      recommendUnit = items[indexOfUnit + 1].unit;
    }
  }

  return recommendUnit;
};

const PlaylistCollectionPage = ({ collection, nextLink = null, prevLink = null, cuId, t }) => {
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

  // we need to calculate the playlist here, so we can filter items out of recommended
  // playlist { collection, language, mediaType, items, groups };
  useEffect(() => {
    const { mediaType, language } = playlist || {}
    const newMediaType = playerHelper.getMediaTypeFromQuery(location);
    const qryContentLang = playerHelper.getLanguageFromQuery(location, language || contentLanguage);

    if (playlist) {
      if (newMediaType !== mediaType ||
        qryContentLang !== language) {
        const nPlaylist = playerHelper.playlist(collection, newMediaType, qryContentLang, language);
        setPlaylist(nPlaylist);
      }
    } else {
      const nPlaylist = playerHelper.playlist(collection, newMediaType, qryContentLang, uiLanguage);
      setPlaylist(nPlaylist);
    }
  }, [collection, contentLanguage, location, playlist, uiLanguage]);

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

  const shufflePlaylist = () => {
    const selectedItem = playlist.items[selected];
    // a new array for sorting
    const newPlaylistItems = [...playlist.items];
    // random sorting of the playlist
    randomizeArray(newPlaylistItems)
    const newSelectedIndex = newPlaylistItems.indexOf(selectedItem);
    // replace current items by shuffled
    playlist.items = [...newPlaylistItems];
    setSelected(newSelectedIndex);
  }

  useEffect(() => {
    const newSel = playlist?.items.findIndex(i => i.unit.id === cuId);
    if (!isNaN(newSel) && newSel !== -1) {
      setSelected(newSel);
      const newUnit = playlist?.items[newSel]?.unit;
      setUnit(newUnit);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playlist, cuId]);

  if (!collection || !Array.isArray(collection.content_units)) {
    return null;
  }

  if (!playlist || !unit) {
    return null;
  }

  const { items, name } = playlist;
  const filterOutUnits  = items.map(item => item.unit).filter(u => !!u) || [];

  // Don't recommend lesson preparation, skip to next unit.
  const recommendUnit = getRecommendUnit(unit, collection, items);

  const { content_type } = collection;

  const startWithAutoPlay = content_type === CT_SONGS;
  const randomButton = content_type === CT_SONGS &&
    <Button
      title={t('playlist.shuffle')}
      style={{ padding: 'inherit', fontSize: '1em' }}
      icon='random'
      circular
      primary
      onClick={() => shufflePlaylist()}
    >
    </Button>

  const playlistData = (
    <>
      <div id="avbox_playlist">
        {
          isMobileDevice
            ? <div style={{ float: 'right', padding: '0.3em' }}>{ randomButton }</div>
            : <Header as="h3" className={'avbox__playlist-header h3'}>
              {name || t(`playlist.title-by-type.${content_type}`)}
              {randomButton}
            </Header>
        }
      </div>
      <div id="avbox_playlist_container" className="avbox__playlist-view">
        <Playlist
          playlist={playlist}
          selected={selected}
        />
      </div>
      <br />
      <Recommended unit={recommendUnit} filterOutUnits={filterOutUnits} />
    </>
  );

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
            startWithAutoPlay={startWithAutoPlay}
          />
          {
            unit &&
            <Container id="unit_container">
              <Helmets.AVUnit unit={unit} language={uiLanguage} />
              <Info unit={unit} currentCollection={collection} />
              <Materials unit={unit} playlistComponent={playlistData} />
            </Container>
          }
        </Grid.Column>
        {
          !isMobileDevice &&
          <Grid.Column mobile={16} tablet={6} computer={6}>
            {playlistData}
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
        startWithAutoPlay={startWithAutoPlay}
      />
    </Container>;
};

PlaylistCollectionPage.propTypes = {
  collection: shapes.GenericCollection,
  nextLink: PropTypes.string,
  prevLink: PropTypes.string,
  cuId: PropTypes.string,
  t: PropTypes.func.isRequired
};

const isEqualLink = (link1, link2) =>
  (!link1 && !link2) || link1 === link2;

const areEqual = (prevProps, nextProps) => (
  isEqual(prevProps.collection, nextProps.collection)
  && ((!prevProps.cuId && !nextProps.cuId) || prevProps.cuId === nextProps.cuId)
  && isEqualLink(prevProps.prevLink, nextProps.prevLink)
  && isEqualLink(prevProps.nextLink, nextProps.nextLink)
);

export default React.memo(withNamespaces()(PlaylistCollectionPage), areEqual);
