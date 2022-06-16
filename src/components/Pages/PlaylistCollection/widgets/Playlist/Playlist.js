import React, { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'react-fast-compare';
import { withNamespaces } from 'react-i18next';

import { DeviceInfoContext } from '../../../../../helpers/app-contexts';
import ContentItemContainer from '../../../../shared/ContentItem/ContentItemContainer';
import { Header, Button } from 'semantic-ui-react';
import { CT_SONGS } from '../../../../../helpers/consts';


const PlaylistWidget = ({ playlist, selected = 0, shufflePlaylist, link, t }) => {
  const { isMobileDevice } = useContext(DeviceInfoContext);

  const { collection, items, name } = playlist;
  const { content_type } = collection;

  useEffect(() => {
    // scroll to the selected items
    if (selected > 0) {
      const { id } = items[selected].unit
      const element = document.getElementById(id);
      if (element === null) {
        return;
      }

      element.scrollIntoView();
      window.scrollTo(0, 0);
    }

  }, [items, selected])

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
        items.map((item, i) => (
          <ContentItemContainer
            key={item.unit.id}
            id={item.unit.id}
            ccuId={collection.id}
            size="small"
            asList={true}
            selected={i === selected}
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
  shufflePlaylist: PropTypes.func,
  t: PropTypes.func
};

const areEqual = (prevProps, nextProps) => (
  nextProps.selected === prevProps.selected
  && nextProps.link === prevProps.link
  && isEqual(nextProps.playlist, prevProps.playlist)
);

export default React.memo(withNamespaces()(PlaylistWidget), areEqual);
