import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { selectors as mdb, actions } from '../../../redux/modules/mdb';
import { OFFSET_TEXT_SEPARATOR } from '../../../helpers/scrollToSearch/helper';
import { buildOffsets } from './helper';

export const useLabels = (content_unit, language) => {
  const ids    = useSelector(state => mdb.getLabelsByCU(state.mdb, content_unit)) || [];
  const denorm = useSelector(state => mdb.getDenormLabel(state.mdb));
  const labels = ids
    .map(denorm)
    .filter(l => (l.properties?.srchstart || l.properties?.srchend))
    .map(l => ({ type: 'label', ...l }));

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actions.fetchLabels({ content_unit, language }));
  }, [content_unit, language]);

  const offsets = buildOffsets(labels);

  return { labels, offsets };
};
