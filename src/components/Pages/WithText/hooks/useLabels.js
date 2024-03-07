import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { buildOffsets } from '../helper';
import {
  textPageGetSubjectSelector,
  textPageGetFileSelector,
  mdbGetLabelsByCUSelector,
  mdbGetLabelsById
} from '../../../../redux/selectors';

export const useLabels = () => {
  const { id }       = useSelector(textPageGetSubjectSelector);
  const { language } = useSelector(textPageGetFileSelector);
  const ids          = useSelector(state => mdbGetLabelsByCUSelector(state, id));
  const byId         = useSelector(mdbGetLabelsById);

  const labels = useMemo(() => ids?.map(_id => byId[_id])
    .filter(l => (l.properties?.srchstart || l.properties?.srchend))
    .filter(l => l.properties?.language === language)
    .map(l => ({ type: 'label', ...l }))
  , [byId, ids]) || [];

  const offsets = buildOffsets(labels);

  return { labels, offsets };
};
