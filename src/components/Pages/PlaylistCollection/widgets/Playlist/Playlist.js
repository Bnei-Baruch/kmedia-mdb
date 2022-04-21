import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'react-fast-compare';
import { Button, Header } from 'semantic-ui-react';
import { withNamespaces } from 'react-i18next';
import { useLocation } from 'react-router';

import { DeviceInfoContext } from '../../../../../helpers/app-contexts';
import ContentItemContainer from '../../../../shared/ContentItem/ContentItemContainer';
import { CT_SONGS } from '../../../../../helpers/consts';
import {  randomizeArray } from '../../../../../helpers/utils';


const randomizePlaylist = (playlistItems, selectedIndex) => {
  const selectedItem = playlistItems[selectedIndex];
  const newPlaylistItems = [...playlistItems];

  // random sorting of the playlist
  randomizeArray(newPlaylistItems)
  const newSelectedIndex = newPlaylistItems.indexOf(selectedItem);

  return { newPlaylistItems, newSelectedIndex }
}


const PlaylistWidget = ({ playlist, selected = 0, link, t }) => {
  const location = useLocation();
  const { isMobileDevice } = useContext(DeviceInfoContext);
  const { collection, items, name } = playlist;

  const [selectedIndex, setSelectedIndex] = useState(selected);
  const [playlistItems, setPlaylistItems] = useState(items);

  const randomize = () => {
    const { newPlaylistItems, newSelectedIndex } = randomizePlaylist(playlistItems, selectedIndex);
    setPlaylistItems(newPlaylistItems);
    setSelectedIndex(newSelectedIndex);
  }

  useEffect(() => {
    // select the item which url we are currently on
    const currentIndex = playlistItems.findIndex(item => location.pathname.includes(item.shareUrl));
    setSelectedIndex(currentIndex);
  }, [location, playlistItems])

  const { content_type } = collection;

  const randomButton = content_type === CT_SONGS &&
    <Button
      title={t('playlist.shuffle')}
      style={{ padding: 'inherit', fontSize: '1em' }}
      icon='random'
      circular
      positive
      onClick={() => randomize()}
    >
    </Button>


  return (
    <div id="avbox_playlist" className="avbox__playlist-view">
      {
        isMobileDevice
          ? <div style={{ float: 'right', padding: '0.3em' }}>{ randomButton }</div>
          : <Header as="h3" className={'avbox__playlist-header h3'}>
            {name || t(`playlist.title-by-type.${content_type}`)}
            {randomButton}
          </Header>
      }
      {
        playlistItems.map((item, i) => (
          <ContentItemContainer
            key={item.unit.id}
            id={item.unit.id}
            ccuId={collection.id}
            size="small"
            asList={true}
            selected={i === selectedIndex}
            link={link ? `${link}?ap=${i}` : null}
          />
        ))
      }
    </div>
  );
};

PlaylistWidget.propTypes = {
  playlist: PropTypes.shape({}).isRequired,
  selected: PropTypes.number,
  link: PropTypes.string,
};

const areEqual = (prevProps, nextProps) => (
  nextProps.selected === prevProps.selected
  && nextProps.link === prevProps.link
  && isEqual(nextProps.playlist, prevProps.playlist)
);

export default React.memo(withNamespaces()(PlaylistWidget), areEqual);
