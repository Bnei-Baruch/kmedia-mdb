import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { myNotesGetListSelector, myNotesGetByIdSelector } from '../../../../redux/selectors';

export const useNotes = () => {
  const ids   = useSelector(myNotesGetListSelector);
  const byId  = useSelector(myNotesGetByIdSelector);

  const notes = useMemo(() => ids
    .map(id => byId[id])
    .map(n => ({ type: 'note', ...n }))
  , [byId, ids]);

  return notes;
};
