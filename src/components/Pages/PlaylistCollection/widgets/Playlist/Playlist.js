import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'react-fast-compare';
import ContentItemContainer from '../../../../shared/ContentItem/ContentItemContainer';


const PlaylistWidget = ({ playlist, selected = 0, link }) => {
  const { collection, items } = playlist;

  useEffect(() => {
    // scroll to the selected items
    if (selected > 0) {
      const { id } = items[selected].unit
      const element = document.getElementById(id);
      if (element === null) {
        return;
      }

      element.scrollIntoView()
      window.scrollTo(0, 0);
    }

  }, [items, selected])

  return (
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
  )
};

PlaylistWidget.propTypes = {
  playlist: PropTypes.shape({}).isRequired,
  selected: PropTypes.number,
  link: PropTypes.string,
};

const areEqual = (prevProps, nextProps) => (
  nextProps.selected === prevProps.selected
  && ((!nextProps.link && !prevProps.link) || nextProps.link === prevProps.link)
  && isEqual(nextProps.playlist, prevProps.playlist)
);

export default React.memo(PlaylistWidget, areEqual);
