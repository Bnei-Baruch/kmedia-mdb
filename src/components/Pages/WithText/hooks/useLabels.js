import { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { selectors as mdb, actions } from '../../../../redux/modules/mdb';
import { buildOffsets } from '../helper';
import { selectors as textPage } from '../../../../redux/modules/textPage';

export const useLabels = () => {
  const { id }       = useSelector(state => textPage.getSubject(state.textPage));
  const { language } = useSelector(state => textPage.getFile(state.textPage));
  const ids          = useSelector(state => mdb.getLabelsByCU(state.mdb, id)) || [];
  const byId         = useSelector(state => mdb.getLabelById(state.mdb));
  const labels       = useMemo(() => ids.map(_id => byId[_id])
      .filter(l => (l.properties?.srchstart || l.properties?.srchend))
      .map(l => ({ type: 'label', ...l }))
    , [byId, ids]);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actions.fetchLabels({ content_unit: id, language }));
  }, [id, language]);

  const offsets = buildOffsets(labels);

  return { labels, offsets };
};
