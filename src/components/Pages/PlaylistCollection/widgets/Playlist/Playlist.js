import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'react-fast-compare';
import { useSelector, useDispatch } from 'react-redux';

import { selectors as my, actions as myActions } from '../../../../../redux/modules/my';
import { MY_NAMESPACE_HISTORY } from '../../../../../helpers/consts';
import ContentItemContainer from '../../../../shared/ContentItem/ContentItemContainer';


const PlaylistWidget = ({ playlist, selected = 0, link }) => {
  const { collection, items } = playlist;

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(myActions.fetch(MY_NAMESPACE_HISTORY, { cu_uids: items.map(it => it.unit.id) }));
  }, [dispatch, items]);

  const historyItems = useSelector(state => my.getList(state.my, MY_NAMESPACE_HISTORY)) || [];

  const getPersonalHistoryPlayTime = unitId => {
    const historyUnit = historyItems.find(x => x.content_unit_uid === unitId);
    return historyUnit?.data.current_time
  };

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

  return (
    items.map((item, i) => (
      <ContentItemContainer
        key={item.unit.id}
        id={item.unit.id}
        ccuId={collection.id}
        size="small"
        asList={true}
        playTime={getPersonalHistoryPlayTime(item.unit.id)}
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
