import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { actions } from '../../../redux/modules/myNotes';
import { buildOffsets } from './helper';
import { myNotesGetByIdSelector, myNotesGetListSelector } from '../../../redux/selectors';

export const useNotes = (subject_uid, language) => {
  const ids   = useSelector(myNotesGetListSelector);
  const notes = useSelector(state => ids
    .map(id => myNotesGetByIdSelector(state, id))
    .map(n => ({ type: 'note', ...n }))
  ) || [];

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(actions.fetch({ subject_uid, language }));
  }, [subject_uid, language, dispatch]);

  const offsets = buildOffsets(notes);

  return { notes, offsets };
};
