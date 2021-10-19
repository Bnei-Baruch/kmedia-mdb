import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'react-fast-compare';

import { DeviceInfoContext } from '../../../../../helpers/app-contexts';
import CUItemContainer from '../../../../shared/CUItem/CUItemContainer';
import { Header } from 'semantic-ui-react';
import { withNamespaces } from 'react-i18next';

const PlaylistWidget = ({ playlist, selected = 0, link, t }) => {
  const { isMobileDevice } = useContext(DeviceInfoContext);

  const { collection, items, name } = playlist;
  const unitsToDisplay        = items.filter(item => !!item.unit).map(item => item.unit);

  return (
    <div id="avbox_playlist" className="avbox__playlist-view">
      {
        !isMobileDevice &&
        <Header
          as="h3"
          className={'avbox__playlist-header h3'}
          content={name || t(`playlist.title-by-type.${collection.content_type}`)}
        />
      }
      {/* cannot use semantic Item because it doesn't recongnize the onClick event */}
      {
        unitsToDisplay.map((unit, i) => (
          <CUItemContainer
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
  && nextProps.nextLink === prevProps.nextLink
  && nextProps.prevLink === prevProps.prevLink
  && isEqual(nextProps.playlist, prevProps.playlist)
);

export default React.memo(withNamespaces()(PlaylistWidget), areEqual);
