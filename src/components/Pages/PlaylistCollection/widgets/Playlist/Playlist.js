import React, { useCallback, useContext } from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import { List } from 'semantic-ui-react';
import isEqual from 'react-fast-compare';

import { DeviceInfoContext } from "../../../../../helpers/app-contexts";
import { renderPlaylistUnit } from '../../../Unit/widgets/Recommended/Main/DisplayRecommended';
import PlaylistHeader from './PlaylistHeader';

const PlaylistWidget = ({ playlist, selected = 0, onSelectedChange, t, prevLink = null, nextLink = null }) => {
  const handleItemClick = useCallback((e, data) => {
    onSelectedChange(parseInt(data.name, 10));
  }, [onSelectedChange]);

  const { isMobileDevice } = useContext(DeviceInfoContext);

  const { collection, items } = playlist;
  const unitsToDisplay = items.filter(item => !!item.unit).map(item => item.unit);

  return (
    <div id="avbox_playlist" className="avbox__playlist-wrapper">
      { !isMobileDevice &&
        <PlaylistHeader collection={collection} prevLink={prevLink} nextLink={nextLink} />
      }
      <div className="avbox__playlist-view">
        {/* cannot use semantic Item because it doesn't recongnize the onClick event */}
        <List selection size="tiny">
          {
            unitsToDisplay.map((unit, index) => (
              <List.Item
                key={unit.id}
                name={`${index}`}
                active={index === selected}
                onClick={handleItemClick}
              >
                {renderPlaylistUnit(unit, t)}
              </List.Item>
            ))
          }
        </List>
      </div>
    </div>
  );
}

PlaylistWidget.propTypes = {
  playlist: PropTypes.shape({}).isRequired,
  selected: PropTypes.number,
  onSelectedChange: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  nextLink: PropTypes.string,
  prevLink: PropTypes.string,
};

const areEqual = (prevProps, nextProps) => (
  nextProps.selected === prevProps.selected
    && nextProps.nextLink === prevProps.nextLink
    && nextProps.prevLink === prevProps.prevLink
    && isEqual(nextProps.playlist, prevProps.playlist)
);

export default React.memo(withNamespaces()(PlaylistWidget), areEqual);
