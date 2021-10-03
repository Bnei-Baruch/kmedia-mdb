import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'react-fast-compare';

import { DeviceInfoContext } from '../../../../../helpers/app-contexts';
import PlaylistHeader from './PlaylistHeader';
import CUItemContainer from '../../../../shared/CUItem/CUItemContainer';

const PlaylistWidget = ({ playlist, selected = 0, link, prevLink = null, nextLink = null }) => {
  const { isMobileDevice } = useContext(DeviceInfoContext);

  const { collection, items } = playlist;
  const unitsToDisplay        = items.filter(item => !!item.unit).map(item => item.unit);

  return (
    <div id="avbox_playlist" className="avbox__playlist-view">
      {!isMobileDevice && <PlaylistHeader collection={collection} prevLink={prevLink} nextLink={nextLink} />}

      {/* cannot use semantic Item because it doesn't recongnize the onClick event */}
      {
        unitsToDisplay.map((unit, i) => (
          <CUItemContainer
            key={unit.id}
            id={unit.id}
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
  nextLink: PropTypes.string,
  prevLink: PropTypes.string,
  link: PropTypes.string,
};

const areEqual = (prevProps, nextProps) => (
  nextProps.selected === prevProps.selected
  && nextProps.nextLink === prevProps.nextLink
  && nextProps.prevLink === prevProps.prevLink
  && isEqual(nextProps.playlist, prevProps.playlist)
);

export default React.memo(PlaylistWidget, areEqual);
