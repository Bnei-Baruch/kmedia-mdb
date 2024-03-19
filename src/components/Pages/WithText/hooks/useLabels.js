import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { buildOffsets } from '../helper';
import {
  textPageGetSubjectSelector,
  textPageGetFileSelector,
  mdbGetLabelsByCUSelector,
  mdbGetLabelsById,
  textPageGetAdditionsModeSelector,
  authGetUserSelector
} from '../../../../redux/selectors';
import { TEXT_PAGE_ADDITIONS_MODS } from '../../../../helpers/consts';

export const useLabels = () => {
  const { id }        = useSelector(textPageGetSubjectSelector);
  const { language }  = useSelector(textPageGetFileSelector);
  const ids           = useSelector(state => mdbGetLabelsByCUSelector(state, id));
  const byId          = useSelector(mdbGetLabelsById);
  const additionsMode = useSelector(textPageGetAdditionsModeSelector);
  const userName      = useSelector(authGetUserSelector)?.name;

  const labels = useMemo(() => {
      return ids?.map(_id => byId[_id])
        .filter(l => additionsMode !== TEXT_PAGE_ADDITIONS_MODS.showMy || l.author === userName)
        .filter(l => (l.properties?.srchstart || l.properties?.srchend))
        .filter(l => l.properties?.language === language)
        .map(l => ({ type: 'label', ...l }));
    }
    , [byId, ids, additionsMode, userName]) || [];

  const offsets = buildOffsets(labels);

  return { labels, offsets };
};
