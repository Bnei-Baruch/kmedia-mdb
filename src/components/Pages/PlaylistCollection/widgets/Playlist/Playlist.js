import React, { useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'react-fast-compare';
import { withNamespaces } from 'react-i18next';
import { useLocation } from 'react-router';

import { DeviceInfoContext } from '../../../../../helpers/app-contexts';
import ContentItemContainer from '../../../../shared/ContentItem/ContentItemContainer';
import { Header, Button } from 'semantic-ui-react';
import { CT_HOLIDAY, CT_LESSONS_SERIES, CT_SONGS } from '../../../../../helpers/consts';
import {  randomizeArray, strCmp } from '../../../../../helpers/utils';


const PlaylistWidget = ({ playlist, selected = 0, link, t }) => {
  const { isMobileDevice } = useContext(DeviceInfoContext);
  const location = useLocation();

  const { collection, items, name } = playlist;
  const { content_type, ccuNames } = collection;

  const getCollectionPartNumber = unitId => {
    const defaultVal = 1000000;
    const num = Number(ccuNames[unitId]);

    // put items with not valid collection part numbers at the end
    return (isNaN(num) || num <= 0) ? defaultVal : num;
  }

  const sortItems = (item1, item2) => {
    const val1 = getCollectionPartNumber(item1.unit.id);
    const val2 = getCollectionPartNumber(item2.unit.id);
    let result = val1 - val2

    // if equal part number, sort by date and then name
    if (result === 0) {
      result = strCmp(item1.unit.film_date, item2.unit.film_date)
      return result === 0 ? strCmp(item1.unit.name, item2.unit.name) : result;
    }

    return result;
  }

  // initially sort items by episode/song number
  if ([CT_SONGS, CT_LESSONS_SERIES, CT_HOLIDAY].includes(content_type))
    items.sort(sortItems);

  const [selectedIndex, setSelectedIndex] = useState(selected);
  const [playlistItems, setPlaylistItems] = useState(items);

  const randomize = () => {
    const selectedItem = playlistItems[selectedIndex];
    // a new array for sorting
    const newPlaylistItems = [...playlistItems];
    // random sorting of the playlist
    randomizeArray(newPlaylistItems)
    const newSelectedIndex = newPlaylistItems.indexOf(selectedItem);

    setPlaylistItems(newPlaylistItems);
    setSelectedIndex(newSelectedIndex);
  }

  useEffect(() => {
    // select the item which url we are currently on
    const currentIndex = playlistItems.findIndex(item => location.pathname.includes(item.shareUrl));
    setSelectedIndex(currentIndex);
  }, [location, playlistItems])

  const randomButton = content_type === CT_SONGS &&
    <Button
      title={t('playlist.shuffle')}
      style={{ padding: 'inherit', fontSize: '1em' }}
      icon='random'
      circular
      primary
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
  )
};

PlaylistWidget.propTypes = {
  playlist: PropTypes.shape({}).isRequired,
  selected: PropTypes.number,
  link: PropTypes.string,
};

const areEqual = (prevProps, nextProps) => (
  nextProps.selected === prevProps.selected
  && nextProps.playlist?.collection?.id === prevProps.playlist?.collection?.id
  && nextProps.link === prevProps.link
  && isEqual(nextProps.playlist, prevProps.playlist)
);

export default React.memo(withNamespaces()(PlaylistWidget), areEqual);
