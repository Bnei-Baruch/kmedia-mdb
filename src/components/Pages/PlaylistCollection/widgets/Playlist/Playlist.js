import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'react-fast-compare';

import { DeviceInfoContext } from '../../../../../helpers/app-contexts';
import ContentItemContainer from '../../../../shared/ContentItem/ContentItemContainer';
import { Button, Header } from 'semantic-ui-react';
import { withNamespaces } from 'react-i18next';

const PlaylistWidget = ({ playlist, selected = 0, link, t }) => {
  const { isMobileDevice } = useContext(DeviceInfoContext);
  const { collection, items, name } = playlist;

  const [unitsToDisplay, setUnitsToDisplay] = useState(items.filter(item => !!item.unit).map(item => item.unit))

  const randomize = () => {
    const newUnitsToDisplay = [...unitsToDisplay];
    // create an array of randoms and sort units by it
    const randomArr = newUnitsToDisplay.map(() => Math.random() * newUnitsToDisplay.length);
    newUnitsToDisplay.sort((a, b) => {
      const ai = newUnitsToDisplay.indexOf(a);
      const bi = newUnitsToDisplay.indexOf(b);

      return randomArr[ai] - randomArr[bi];
    })

    setUnitsToDisplay(newUnitsToDisplay);
  }

  return (
    <div id="avbox_playlist" className="avbox__playlist-view">
      {
        !isMobileDevice &&
        <Header as="h3" className={'avbox__playlist-header h3'}>
          {name || t(`playlist.title-by-type.${collection.content_type}`)}
          <Button title={t('playlist.shuffle')} style={{ padding: 'inherit', fontSize: '1em' }} icon='random' circular positive onClick={() => randomize()}></Button>
        </Header>
      }
      {
        unitsToDisplay.map((unit, i) => (
          <ContentItemContainer
            key={unit.id}
            id={unit.id}
            ccuId={collection.id}
            size="small"
            asList={true}
            selected={i === selected}
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
