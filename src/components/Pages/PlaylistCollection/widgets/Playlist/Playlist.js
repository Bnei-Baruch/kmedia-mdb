import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'react-fast-compare';

import { DeviceInfoContext } from '../../../../../helpers/app-contexts';
import ContentItemContainer from '../../../../shared/ContentItem/ContentItemContainer';
import { Button, Header } from 'semantic-ui-react';
import { withNamespaces } from 'react-i18next';
import { useLocation } from 'react-router';
import { CT_SONGS } from '../../../../../helpers/consts';

const PlaylistWidget = ({ playlist, selected = 0, link, t }) => {
  const location = useLocation();
  const { isMobileDevice } = useContext(DeviceInfoContext);
  const { collection, items, name } = playlist;

  const [selectedIndex, setSelectedIndex] = useState(selected);
  const [playlistItems, setPlaylistItems] = useState(items);

  const randomize = () => {
    const selectedItem = playlistItems[selectedIndex];
    const newPlaylistItems = [...playlistItems];

    // create an array of randoms and sort items by it
    const randomArr = newPlaylistItems.map(() => Math.random() * newPlaylistItems.length);
    newPlaylistItems.sort((a, b) => {
      const ai = newPlaylistItems.indexOf(a);
      const bi = newPlaylistItems.indexOf(b);

      return randomArr[ai] - randomArr[bi];
    })

    const newSelectedIndex = newPlaylistItems.indexOf(selectedItem);
    setPlaylistItems(newPlaylistItems);
    setSelectedIndex(newSelectedIndex);
  }

  useEffect(() => {
    // select the item which url we are currently on
    const currentIndex = playlistItems.findIndex(item => location.pathname.includes(item.shareUrl));
    setSelectedIndex(currentIndex);
  }, [location, playlistItems])

  const { content_type } = collection;

  return (
    <div id="avbox_playlist" className="avbox__playlist-view">
      {
        !isMobileDevice &&
        <Header as="h3" className={'avbox__playlist-header h3'}>
          {name || t(`playlist.title-by-type.${content_type}`)}
          {content_type === CT_SONGS &&
            <Button
              title={t('playlist.shuffle')}
              style={{ padding: 'inherit', fontSize: '1em' }}
              icon='random'
              circular
              positive
              onClick={() => randomize()}
            >
            </Button>
          }
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
