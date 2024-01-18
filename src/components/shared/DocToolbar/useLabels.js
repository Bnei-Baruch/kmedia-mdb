import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { actions as mdbActions } from '../../../redux/modules/mdb';
import { buildOffsets } from './helper';
import { mdbGetDenormLabelSelector, mdbGetLabelsByCUSelector } from '../../../redux/selectors';

export const useLabels = (content_unit, language) => {
  const ids    = useSelector(state => mdbGetLabelsByCUSelector(state, content_unit)) || [];
  const denorm = useSelector(mdbGetDenormLabelSelector);
  const labels = ids
    .map(denorm)
    .filter(l => (l.properties?.srchstart || l.properties?.srchend))
    .map(l => ({ type: 'label', ...l }));

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(mdbActions.fetchLabels({ content_unit, language }));
  }, [content_unit, language]);

  const offsets = buildOffsets(labels);

  return { labels, offsets };
};
