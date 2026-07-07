import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { myNotesGetListSelector, myNotesGetByIdSelector, textPageGetSubjectSelector } from '../../../../redux/selectors';

export const useNotes = () => {
  const ids     = useSelector(myNotesGetListSelector);
  const byId    = useSelector(myNotesGetByIdSelector);
  const subject = useSelector(textPageGetSubjectSelector);

  const notes = useMemo(() => ids
    .map(id => byId[id])
    .filter(n => n?.subject_uid === subject?.id)
    .map(n => ({ type: 'note', ...n }))
  , [byId, ids, subject?.id]);

  return notes;
};
