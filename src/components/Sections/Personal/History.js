import React, { useEffect } from 'react';
import { actions, selectors } from '../../../redux/modules/my';
import { useDispatch, useSelector } from 'react-redux';
import { selectors as mdb } from '../../../redux/modules/mdb';
import Template, { renderHistoryItem } from './helper';

const History = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actions.fetchHistory());
  }, [dispatch]);

  const hs = useSelector(state => selectors.getHistory(state.my));

  const denormHistory = hs => state => {
    if (!Array.isArray(hs)) return [];
    return hs.map(({ unit_uid, data: { current_time } }) => {
      const unit = mdb.getDenormContentUnit(state.mdb, unit_uid);
      return { ...unit, current_time };
    });
  };

  const histories = useSelector(denormHistory(hs));

  if (histories.length === 0) return null;

  return (
    <Template items={histories} title={'History'} renderUnit={renderHistoryItem} />
  );
};

export default History;
